import { Injectable } from '@nestjs/common';
import { GenericError } from 'src/shared/helpers/generic-error';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { CreateOngPaymentUserConfigDto } from '../dto/create-ong-payment-user-config.dto';
import { UpdateOngPaymentUserConfigDto } from '../dto/update-ong-payment-user-config.dto';
import { OngPaymentUserConfig } from '../entities/ong-payment-user-config.entity';

@Injectable()
export class OngPaymentUserConfigRepository extends Repository<OngPaymentUserConfig> {
    constructor(private dataSource: DataSource) {
        super(OngPaymentUserConfig, dataSource.createEntityManager());
    }

    async saveOPUC(data: CreateOngPaymentUserConfigDto): Promise<OngPaymentUserConfig> {
        const opuc: OngPaymentUserConfig = this.create({
            percent: data.percent,
            amount: data.amount,
            ongUserConfig: data.ongUserConfig,
            ongPaymentUserConfigState: data.ongPaymentUserConfigState,
            ongPayment: data.ongPayment,
        });

        return await this.save(opuc);
    }

    async findOneOPUC(options: FindOneOptions<OngPaymentUserConfig>): Promise<OngPaymentUserConfig> {
        const opuc: OngPaymentUserConfig = await this.findOne(options);

        if (!opuc) {
            GenericError.throw(404, 'OngPaymentUserConfig not found', 'Not found');
        }

        return opuc;
    }

    async updateOPUC(
        options: FindOneOptions<OngPaymentUserConfig>,
        data: UpdateOngPaymentUserConfigDto,
    ): Promise<OngPaymentUserConfig> {
        const opuc: OngPaymentUserConfig = await this.findOneOPUC(options);

        opuc.percent = data.percent;
        opuc.amount = data.percent;
        opuc.ongUserConfig = data.ongUserConfig;
        opuc.ongPaymentUserConfigState = data.ongPaymentUserConfigState;
        opuc.ongPayment = data.ongPayment;

        return await this.save(opuc);
    }

    async getTotalDonateByUser(userId: number): Promise<any> {
        // Note: QueryBuilder is used for this service because it was more efficient to delegate
        // the entire process to the database.
        const queryBuilder = this.createQueryBuilder('i')
            .select('SUM(i.amount) as "totalDonate"')
            .innerJoin('i.ongUserConfig', 'ouc')
            .innerJoin('i.ongPaymentUserConfigState', 'opcs')
            .where('ouc.user_id = :userId', { userId })
            .andWhere('opcs.name = :state', { state: 'Pagado' });

        return { totalDonate: parseFloat((await queryBuilder.getRawOne()).totalDonate) };
    }

    async updateManyStates(opId: number): Promise<any> {
        const updateResult = await this.update({ ongPayment: { id: opId } }, { ongPaymentUserConfigState: { id: 2 } });

        return updateResult.affected === 0 ? false : true;
    }
}
