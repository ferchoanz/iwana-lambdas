import { Injectable } from '@nestjs/common';
import { GenericError } from 'src/shared/helpers/generic-error';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { CreateOngPaymentHistoryDto } from '../dto/create-ong-payment-history.dto';
import { OngPaymentHistory } from '../entities/ong-payment-history.entity';

@Injectable()
export class OngPaymentHistoryRepository extends Repository<OngPaymentHistory> {
    constructor(private dataSource: DataSource) {
        super(OngPaymentHistory, dataSource.createEntityManager());
    }

    async saveOPH(data: CreateOngPaymentHistoryDto): Promise<OngPaymentHistory> {
        const oph: OngPaymentHistory = this.create({
            ongPayment: data.ongPayment,
            ongPaymentState: data.ongPaymentState,
        });

        return await this.save(oph);
    }

    async findOneOPH(options: FindOneOptions<OngPaymentHistory>): Promise<OngPaymentHistory> {
        const oph: OngPaymentHistory = await this.findOne(options);

        if (!oph) {
            GenericError.throw(404, 'OngPaymentHistory not found', 'Not found');
        }

        return oph;
    }
}
