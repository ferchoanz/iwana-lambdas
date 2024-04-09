import { ICriteria } from '@digichanges/shared-experience';
import { Injectable } from '@nestjs/common';
import CreateFilterHelper from 'src/shared/helpers/CreateSqlFilterHelper';
import { GenericError } from 'src/shared/helpers/generic-error';
import { Paginate } from 'src/shared/Paginate';
import { Paginator } from 'src/shared/Paginator';
import { User } from 'src/users/user.entity';
import { DataSource, FindOneOptions, In, Repository, UpdateResult } from 'typeorm';
import { UserAmountDonateFilter } from '../criterias/user-amount-donate.filter';
import { CreateUserAmountDonateDto } from '../dto/create-user-amount-donate.dto';
import { UpdateUserAmountDonateDto } from '../dto/update-user-amount-donate.dto';
import { UserAmountDonate } from '../entities/user-amount-donate.entity';

@Injectable()
export class UserAmountDonateRepository extends Repository<UserAmountDonate> {
    constructor(private dataSource: DataSource) {
        super(UserAmountDonate, dataSource.createEntityManager());
    }

    async saveUAD(data: CreateUserAmountDonateDto): Promise<UserAmountDonate> {
        const uad: UserAmountDonate = this.create({
            user: data.user as User,
            percent: data.percent,
        });

        return await this.save(uad);
    }

    async findOneUAD(options: FindOneOptions<UserAmountDonate>, initThrow = true): Promise<UserAmountDonate> {
        const uad: UserAmountDonate = await this.findOne(options);

        if (!uad && initThrow) {
            GenericError.throw(404, 'UserAmountDonate not found', 'Not found');
        }

        return uad;
    }

    // eslint-disable-next-line prettier/prettier
    async updateUAD(
        options: FindOneOptions<UserAmountDonate>,
        data: UpdateUserAmountDonateDto,
    ): Promise<UserAmountDonate> {
        const uad: UserAmountDonate = await this.findOneUAD(options);

        uad.percent = data.percent;
        uad.is_active = data.is_active;

        return await this.save(uad);
    }

    async softDeleteUAD(options: FindOneOptions<UserAmountDonate>): Promise<UserAmountDonate> {
        const uad: UserAmountDonate = await this.findOneUAD(options);

        const updateResult = await this.softDelete({ id: uad.id });
        if (updateResult.affected === 0) {
            GenericError.throw(500, 'Failed to remove UserAmountDonate');
        }

        return uad;
    }

    async findAll(criteria: ICriteria): Promise<any> {
        const queryBuilder = this.createQueryBuilder('i').where('1 = 1');

        const filter = new CreateFilterHelper(criteria.getFilter(), queryBuilder);

        filter.createFilter(UserAmountDonateFilter.USER, 'andWhere', '=');
        filter.createFilter(UserAmountDonateFilter.ONG, 'andWhere', '=', 'ouc');
        filter.createFilter(UserAmountDonateFilter.PERCENT, 'andWhere', '=');
        filter.createFilter(
            { attribute: UserAmountDonateFilter.IS_ACTIVE, dbAttribute: 'is_active', isBoolean: true },
            'andWhere',
            '=',
        );

        queryBuilder.innerJoin('i.user', 'user');
        queryBuilder.leftJoin('user.ongUserConfig', 'ouc');
        queryBuilder.leftJoin('ouc.ong', 'ong');

        queryBuilder.select([
            'i',
            'user.id',
            'user.name',
            'user.email',
            'ouc.id',
            'ouc.percent',
            'ong.name',
            'ong.brand',
        ]);

        await filter.search(
            UserAmountDonateFilter.SEARCH,
            {
                partialMatch: true,
                attributesDB: [
                    { name: 'name', setWeight: 'B', tableAlias: 'user' },
                    { name: 'email', setWeight: 'A', tableAlias: 'user' },
                ],
            },
            'andWhere',
        );

        const paginator = new Paginator(queryBuilder, criteria, { offsetLimit: true });
        return new Paginate(paginator).paginate();
    }

    async findAllActives(): Promise<UserAmountDonate[]> {
        return await this.find({ where: { is_active: true }, relations: ['user'] });
    }

    async desactiveDonations(ids: number[]): Promise<UpdateResult> {
        return await this.update({ id: In(ids) }, { is_active: false });
    }
}
