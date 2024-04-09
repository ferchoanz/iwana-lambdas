import { ICriteria } from '@digichanges/shared-experience';
import { Injectable } from '@nestjs/common';
import { EmailsService } from 'src/emails/emails.service';
import { OngUserConfigHistoriesService } from 'src/ong-user-config-histories/ong-user-config-histories.service';
import { GenericError } from 'src/shared/helpers/generic-error';
import { UsersService } from 'src/users/users.service';
import { CreateOngUserConfigDto } from './dto/create-ong-user-config.dto';
import { UpdateOngUserConfigDto } from './dto/update-ong-user-config.dto';
import { OngUserConfig } from './entities/ong-user-config.entity';
import { OngUserConfigRepository } from './repositories/ong-user-config.repository';

@Injectable()
export class OngUserConfigsService {
    constructor(
        private readonly ongUserConfigRepository: OngUserConfigRepository,
        private readonly usersService: UsersService,
        private readonly ouchService: OngUserConfigHistoriesService,
        private readonly emailsService: EmailsService,
    ) {}

    async save(data: CreateOngUserConfigDto): Promise<OngUserConfig[]> {
        data.user = await this.usersService.findOne(data.user as number);

        if (await this.usersService.validateIfExistInPayment(data.user.id)) {
            GenericError.throw(422, 'User is in a payment process', 'Unprocessable Entity');
        }

        const oucArray: OngUserConfig[] = await this.ongUserConfigRepository.saveOUC(data);

        await this.ouchService.saveMany(
            oucArray.map((ouc) => {
                return { ongUserConfig: ouc, percent: ouc.percent };
            }),
        );

        // Find all ongUserConfig that have active donations
        const activeDonations: OngUserConfig[] = await this.ongUserConfigRepository.findActiveDonationsByUser(
            data.user.id,
        );

        if (activeDonations.length !== 0) {
            // send email if has activate donations
            this.emailsService.sendEmail(data.user, activeDonations);
        }

        return oucArray;
    }

    async findOne(id: number): Promise<OngUserConfig> {
        return await this.ongUserConfigRepository.findOneOUC({ where: { id } });
    }

    async update(id: number, data: UpdateOngUserConfigDto): Promise<OngUserConfig> {
        const ouc: OngUserConfig = await this.ongUserConfigRepository.updateOUC({ where: { id } }, data);

        await this.ouchService.save({ ongUserConfig: ouc, percent: ouc.percent });

        return ouc;
    }

    async softDelete(id: number): Promise<OngUserConfig> {
        return await this.ongUserConfigRepository.softDeleteOUC({ where: { id } });
    }

    async findAll(criteria: ICriteria): Promise<any> {
        return await this.ongUserConfigRepository.findAll(criteria);
    }

    async findAllToPay(ongId: number, userIds: number[]): Promise<OngUserConfig[]> {
        return await this.ongUserConfigRepository.findAllToPay(ongId, userIds);
    }

    async getIdsFromAllToPay(ongId: number): Promise<number[]> {
        const ids: { id: string }[] = await this.ongUserConfigRepository.getIdsFromAllToPay(ongId);

        return ids.map((objet) => {
            return parseInt(objet.id);
        });
    }

    async getReadyToPayByUser(): Promise<any> {
        const ids: { user_id: string }[] = await this.ongUserConfigRepository.getReadyToPayByUser();

        return ids.map((objet) => {
            return parseInt(objet.user_id);
        });
    }

    async getDistributionPercentSumByUser(userId: number): Promise<number> {
        return this.ongUserConfigRepository.getDistributionPercentSumByUser(userId);
    }
}
