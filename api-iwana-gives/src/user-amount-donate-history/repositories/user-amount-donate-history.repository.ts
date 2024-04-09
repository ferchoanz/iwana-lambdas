import { ICriteria } from '@digichanges/shared-experience';
import { Injectable } from '@nestjs/common';
import CreateFilterHelper from 'src/shared/helpers/CreateSqlFilterHelper';
import { GenericError } from 'src/shared/helpers/generic-error';
import { Paginate } from 'src/shared/Paginate';
import { Paginator } from 'src/shared/Paginator';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { UserAmountDonateHistoryFilter } from '../criterias/user-amount-donate-history.filter';
import { CreateUserAmountDonateHistoryDto } from '../dto/create-user-amount-donate-history.dto';
import { UserAmountDonateHistory } from '../entities/user-amount-donate-history.entity';

@Injectable()
export class UserAmountDonateHistoryRepository extends Repository<UserAmountDonateHistory> {
    constructor(private dataSource: DataSource) {
        super(UserAmountDonateHistory, dataSource.createEntityManager());
    }

    async saveUADH(data: CreateUserAmountDonateHistoryDto): Promise<UserAmountDonateHistory> {
        const uadh: UserAmountDonateHistory = this.create({
            userAmountDonate: data.userAmountDonate,
            percent: data.percent,
        });

        return await this.save(uadh);
    }

    async findOneUADH(
        options: FindOneOptions<UserAmountDonateHistory>,
        initThrow = true,
    ): Promise<UserAmountDonateHistory> {
        const uadh: UserAmountDonateHistory = await this.findOne(options);

        if (!uadh && initThrow) {
            GenericError.throw(404, 'UserAmountDonateHistory not found', 'Not Found');
        }

        return uadh;
    }

    async findOneLastReserved(): Promise<UserAmountDonateHistory> {
        return await this.findOneUADH({ where: { reserved: true }, order: { created_at: 'DESC' } }, false);
    }

    async findUADH(criteria: ICriteria, uadId: number): Promise<any> {
        const queryBuilder = this.createQueryBuilder('i').where('i.user_amount_to_donate_id = :uadId', { uadId });
        const filter = new CreateFilterHelper(criteria.getFilter(), queryBuilder);

        filter.createFilter(UserAmountDonateHistoryFilter.PERCENT, 'andWhere', '=');
        filter.createFilter({ attribute: UserAmountDonateHistoryFilter.RESERVED, isBoolean: true }, 'andWhere', '=');

        const paginator = new Paginator(queryBuilder, criteria);
        return new Paginate(paginator).paginate();
    }
}
