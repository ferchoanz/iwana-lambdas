import { Injectable } from '@nestjs/common';
import { GenericError } from 'src/shared/helpers/generic-error';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { CreateOngPaymentUserConfigStateDto } from '../dto/create-ong-payment-user-config-state.dto';
import { UpdateOngPaymentUserConfigStateDto } from '../dto/update-ong-payment-user-config-state.dto';
import { OngPaymentUserConfigState } from '../entities/ong-payment-user-config-state.entity';

@Injectable()
export class OngPaymentUserConfigStateRepository extends Repository<OngPaymentUserConfigState> {
    constructor(private dataSource: DataSource) {
        super(OngPaymentUserConfigState, dataSource.createEntityManager());
    }

    async saveOPUCS(data: CreateOngPaymentUserConfigStateDto): Promise<OngPaymentUserConfigState> {
        const opucs: OngPaymentUserConfigState = this.create({
            name: data.name,
            description: data.description ? data.description : null,
        });

        return await this.save(opucs);
    }

    async findOneOPUCS(options: FindOneOptions<OngPaymentUserConfigState>): Promise<OngPaymentUserConfigState> {
        const opucs: OngPaymentUserConfigState = await this.findOne(options);

        if (!opucs) {
            GenericError.throw(404, 'OngPaymentUserConfigState not found', 'Not found');
        }

        return opucs;
    }

    async updateOPUCS(
        options: FindOneOptions<OngPaymentUserConfigState>,
        data: UpdateOngPaymentUserConfigStateDto,
    ): Promise<OngPaymentUserConfigState> {
        const opucs: OngPaymentUserConfigState = await this.findOneOPUCS(options);

        opucs.name = data.name;
        opucs.description = data.description ? data.description : opucs.description;

        return await this.save(opucs);
    }

    async findOPUCS(): Promise<OngPaymentUserConfigState[]> {
        const opucs: OngPaymentUserConfigState[] = await this.find();

        return opucs;
    }
}
