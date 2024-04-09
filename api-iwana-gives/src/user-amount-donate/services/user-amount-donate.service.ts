import { ICriteria } from '@digichanges/shared-experience';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { GenericError } from 'src/shared/helpers/generic-error';
import { UserAmountDonateHistoryService } from 'src/user-amount-donate-history/user-amount-donate-history.service';
import { UsersService } from 'src/users/users.service';
import { IBalanceRespose } from '../api/iwana-cash-response.interface';
import { IwanaCashApi } from '../api/iwana-cash.api';
import { CreateUserAmountDonateDto } from '../dto/create-user-amount-donate.dto';
import { UpdateUserAmountDonateDto } from '../dto/update-user-amount-donate.dto';
import { UserAmountDonate } from '../entities/user-amount-donate.entity';
import { UserAmountDonateRepository } from '../repositories/user-amount-donate.repository';
import { OngUserConfigsService } from '../../ong-user-configs/ong-user-configs.service';

@Injectable()
export class UserAmountDonateService {
    constructor(
        private readonly userAmountDonateRepository: UserAmountDonateRepository,
        private readonly uadhService: UserAmountDonateHistoryService,
        private readonly iwanaCashApi: IwanaCashApi,
        private readonly userService: UsersService,
        @Inject(forwardRef(() => OngUserConfigsService))
        private readonly ongUserConfigsService: OngUserConfigsService,
    ) {}

    async save(data: CreateUserAmountDonateDto): Promise<UserAmountDonate> {
        // VALIDATE IF EXIST IN PAYMENT

        if (await this.userService.validateIfExistInPayment(data.user as number)) {
            GenericError.throw(422, 'User is in a payment process', 'Unprocessable Entity');
        }

        if (data.is_active && data.percent <= 0) {
            GenericError.throw(422, 'The percent must be greater than 0 for an active user', 'Unprocessable Entity');
        }

        const distributionPercentSum = await this.ongUserConfigsService.getDistributionPercentSumByUser(data.user as number);

        if (data.is_active && distributionPercentSum < 100) {
            GenericError.throw(422, 'You must select more percent in the foundations below up to 100%', 'Unprocessable Entity');
        }

        let uad: UserAmountDonate = await this.userAmountDonateRepository.findOneUAD(
            {
                where: { user: { id: data.user as number } },
            },
            false,
        );

        if (!uad) {
            uad = await this.userAmountDonateRepository.saveUAD(data);
        } else {
            uad = await this.userAmountDonateRepository.updateUAD({ where: { id: uad.id } }, data);
        }

        await this.uadhService.save({ userAmountDonate: uad, percent: uad.percent });

        return uad;
    }

    async findOne(id: number): Promise<UserAmountDonate> {
        return await this.userAmountDonateRepository.findOneUAD({ where: { id } });
    }

    async findOneByUser(userId: number): Promise<UserAmountDonate> {
        return await this.userAmountDonateRepository.findOneUAD({ where: { user: { id: userId } } });
    }

    async update(id: number, data: UpdateUserAmountDonateDto): Promise<UserAmountDonate> {
        const uad: UserAmountDonate = await this.userAmountDonateRepository.updateUAD({ where: { id } }, data);

        await this.uadhService.save({ userAmountDonate: uad, percent: uad.percent });

        return uad;
    }

    async softDelete(id: number): Promise<UserAmountDonate> {
        return await this.userAmountDonateRepository.softDeleteUAD({ where: { id } });
    }

    async findAll(criteria: ICriteria): Promise<any> {
        return await this.userAmountDonateRepository.findAll(criteria);
    }

    async availableBalance(userId: number): Promise<any> {
        const uad: UserAmountDonate = await this.userAmountDonateRepository.findOneUAD({
            where: { user: { id: userId } },
        });

        const cashBack: IBalanceRespose = await this.iwanaCashApi.getBalance({ userId, countryId: 1 });

        return { availableBalance: parseFloat(cashBack.cashbackAvailable) * (uad.percent / 100) };
    }

    async findAllActives(): Promise<UserAmountDonate[]> {
        return await this.userAmountDonateRepository.findAllActives();
    }
}
