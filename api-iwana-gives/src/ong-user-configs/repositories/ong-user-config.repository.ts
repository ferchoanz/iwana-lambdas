import { ICriteria } from '@digichanges/shared-experience';
import { Injectable } from '@nestjs/common';
import { Ong } from 'src/ongs/entities/ong.entity';
import CreateFilterHelper from 'src/shared/helpers/CreateSqlFilterHelper';
import { GenericError } from 'src/shared/helpers/generic-error';
import { Paginate } from 'src/shared/Paginate';
import { Paginator } from 'src/shared/Paginator';
import { User } from 'src/users/user.entity';
import { DataSource, FindOneOptions, In, MoreThan, Repository } from 'typeorm';
import { OngUserConfigFilter } from '../criterias/ong-user-configs.filter';
import { CreateOngUserConfigDto } from '../dto/create-ong-user-config.dto';
import { UpdateOngUserConfigDto } from '../dto/update-ong-user-config.dto';
import { OngUserConfig } from '../entities/ong-user-config.entity';

@Injectable()
export class OngUserConfigRepository extends Repository<OngUserConfig> {
    constructor(private dataSource: DataSource) {
        super(OngUserConfig, dataSource.createEntityManager());
    }

    async saveOUC(data: CreateOngUserConfigDto): Promise<OngUserConfig[]> {
        const oucArray: OngUserConfig[] = [];
        for await (const config of data.config) {
            const ouc: OngUserConfig = await this.findOne({
                where: { user: { id: (data.user as User).id }, ong: { id: config.ong as number } },
            });

            if (!ouc) {
                oucArray.push(
                    this.create({
                        ong: config.ong as Ong,
                        user: data.user as User,
                        percent: config.percent,
                    }),
                );
            } else {
                if (ouc.percent !== config.percent) {
                    ouc.percent = config.percent;
                    oucArray.push(ouc);
                }
            }
        }

        return await this.save(oucArray);
    }

    async findOneOUC(options: FindOneOptions<OngUserConfig>): Promise<OngUserConfig> {
        const ouc: OngUserConfig = await this.findOne(options);

        if (!ouc) {
            GenericError.throw(404, 'OngUserConfig not found', 'Not found');
        }

        return ouc;
    }

    async updateOUC(options: FindOneOptions<OngUserConfig>, data: UpdateOngUserConfigDto): Promise<OngUserConfig> {
        const ouc: OngUserConfig = await this.findOneOUC(options);

        ouc.percent = data.percent;

        return await this.save(ouc);
    }

    async softDeleteOUC(options: FindOneOptions<OngUserConfig>): Promise<OngUserConfig> {
        const ouc: OngUserConfig = await this.findOneOUC(options);

        const updateResult = await this.softDelete({ id: ouc.id });
        if (updateResult.affected === 0) {
            GenericError.throw(500, 'Failed to delete OngUserConfig');
        }

        return ouc;
    }

    async findAll(criteria: ICriteria): Promise<any> {
        const queryBuilder = this.createQueryBuilder('i').where('1 = 1');
        const filter = new CreateFilterHelper(criteria.getFilter(), queryBuilder);

        filter.createFilter(OngUserConfigFilter.ONG, 'andWhere', '=');
        filter.createFilter(OngUserConfigFilter.USER, 'andWhere', '=');

        queryBuilder.innerJoinAndSelect('i.ong', 'ong');
        queryBuilder.innerJoin('i.user', 'user');

        const paginator = new Paginator(queryBuilder, criteria);
        return new Paginate(paginator).paginate();
    }

    async findActiveDonationsByUser(userId: number): Promise<OngUserConfig[]> {
        const ouc: OngUserConfig[] = await this.find({
            where: { user: { id: userId }, percent: MoreThan(0), ong: { is_active: true } },
            relations: ['ong'],
        });

        return ouc;
    }

    async findAllToPay(ongId: number, userIds: number[]): Promise<OngUserConfig[]> {
        // const queryBuilder = this.createQueryBuilder('i').where('1 = 1');

        // queryBuilder.andWhere('ong.id = :ongId', { ongId });
        // queryBuilder.andWhere('uad.is_active = :isActive', { isActive: true });

        // queryBuilder.innerJoinAndSelect('i.ong', 'ong');
        // queryBuilder.innerJoin('i.user', 'user');
        // queryBuilder.innerJoin('user.userAmountDonate', 'uad');

        const ouc: OngUserConfig[] = await this.find({
            where: { ong: { id: ongId }, user: { id: In(userIds), userAmountDonate: { is_active: true } } },
            relations: ['ong', 'user', 'user.userAmountDonate'],
        });

        return ouc;
    }

    async getIdsFromAllToPay(ongId: number): Promise<any> {
        const queryBuilder = this.createQueryBuilder('i')
            .select('uad.id as "id"')
            .andWhere('i.ong_id = :ongId', { ongId })
            .andWhere('uad.is_active = :isActive', { isActive: true });

        queryBuilder.innerJoin('i.user', 'user');
        queryBuilder.innerJoin('user.userAmountDonate', 'uad');

        return await queryBuilder.getRawMany();
    }

    async getReadyToPayByUser(): Promise<any> {
        const queryBuilder = this.createQueryBuilder('i')
            .select('i.user_id')
            .groupBy('i.user_id')
            .having('sum(i.percent) = 100');

        return await queryBuilder.getRawMany();
    }

    async getDistributionPercentSumByUser(userId: number): Promise<number> {
        return this.sum('percent', { user: { id: userId } });
    }
}
