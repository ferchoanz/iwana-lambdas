import { Injectable } from '@nestjs/common';
import { GenericError } from 'src/shared/helpers/generic-error';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { CreateOngPaymentStateDto } from '../dto/create-ong-payment-state.dto';
import { UpdateOngPaymentStateDto } from '../dto/update-ong-payment-state.dto';
import { OngPaymentState } from '../entities/ong-payment-state.entity';

@Injectable()
export class OngPaymentStateRespository extends Repository<OngPaymentState> {
    constructor(private dataSource: DataSource) {
        super(OngPaymentState, dataSource.createEntityManager());
    }

    async saveOPS(data: CreateOngPaymentStateDto): Promise<OngPaymentState> {
        const ops: OngPaymentState = this.create({
            name: data.name,
            description: data.description ? data.description : null,
        });

        return await this.save(ops);
    }

    async findOneOPS(options: FindOneOptions<OngPaymentState>): Promise<OngPaymentState> {
        const ops: OngPaymentState = await this.findOne(options);

        if (!ops) {
            GenericError.throw(404, 'OngPaymentState not found', 'Not found');
        }

        return ops;
    }

    async updateOPS(
        options: FindOneOptions<OngPaymentState>,
        data: UpdateOngPaymentStateDto,
    ): Promise<OngPaymentState> {
        const ops: OngPaymentState = await this.findOneOPS(options);

        ops.name = data.name;
        ops.description = data.description ? data.description : ops.description;

        return await this.save(ops);
    }

    async findOPS(): Promise<OngPaymentState[]> {
        const ops: OngPaymentState[] = await this.find();

        return ops;
    }
}
