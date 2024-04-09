import { ICriteria } from '@digichanges/shared-experience';
import { Injectable } from '@nestjs/common';
import { GenericError } from 'src/shared/helpers/generic-error';
import { UserAmountDonateHistoryService } from 'src/user-amount-donate-history/user-amount-donate-history.service';
import { UpdateResult } from 'typeorm';
import { UserAmountDonate } from '../entities/user-amount-donate.entity';
import { UserAmountDonateRepository } from '../repositories/user-amount-donate.repository';

@Injectable()
export class UserAmountDonateAdminService {
    constructor(
        private readonly userAmountDonateRepository: UserAmountDonateRepository,
        private readonly uadhService: UserAmountDonateHistoryService,
    ) {}

    async findOne(id: number): Promise<UserAmountDonate> {
        // The queryBuilder was used because the search result was not achieved with the findOneOptions
        const queryBuilder = this.userAmountDonateRepository.createQueryBuilder('i');

        queryBuilder.select([
            'i',
            'user.id',
            'user.name',
            'user.email',
            'ouc.id',
            'ouc.percent',
            'ouc.updated_at',
            'ong.name',
            'ong.brand',
        ]);

        queryBuilder.innerJoin('i.user', 'user');
        queryBuilder.leftJoin('user.ongUserConfig', 'ouc');
        queryBuilder.leftJoin('ouc.ong', 'ong');

        queryBuilder.where('i.id = :id', { id }).andWhere('ong.is_active = true');

        const uad: UserAmountDonate = await queryBuilder.getOne();

        if (!uad) {
            GenericError.throw(404, 'UserAmountDonate not found', 'Not found');
        }

        // uad.user.ongUserConfig.map((ouc))

        return uad;
    }

    async findAll(criteria: ICriteria): Promise<any> {
        return await this.userAmountDonateRepository.findAll(criteria);
    }

    async findHistory(criteria: ICriteria, uadId: number): Promise<any> {
        const uad: UserAmountDonate = await this.userAmountDonateRepository.findOneUAD({ where: { id: uadId } });

        return await this.uadhService.find(criteria, uad.id);
    }

    async desactiveDonations(ids: number[]): Promise<UpdateResult> {
        return await this.userAmountDonateRepository.desactiveDonations(ids);
    }
}
