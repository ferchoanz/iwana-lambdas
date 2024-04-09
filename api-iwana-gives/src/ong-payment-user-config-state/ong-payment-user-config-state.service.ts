import { Injectable } from '@nestjs/common';
import { CreateOngPaymentUserConfigStateDto } from './dto/create-ong-payment-user-config-state.dto';
import { UpdateOngPaymentUserConfigStateDto } from './dto/update-ong-payment-user-config-state.dto';
import { OngPaymentUserConfigState } from './entities/ong-payment-user-config-state.entity';
import { OngPaymentUserConfigStateRepository } from './repositories/ong-payment-user-config-state.repository';

@Injectable()
export class OngPaymentUserConfigStateService {
    constructor(private readonly opucsRepository: OngPaymentUserConfigStateRepository) {}

    async save(data: CreateOngPaymentUserConfigStateDto): Promise<OngPaymentUserConfigState> {
        return await this.opucsRepository.saveOPUCS(data);
    }

    async findOne(id: number): Promise<OngPaymentUserConfigState> {
        return await this.opucsRepository.findOneOPUCS({ where: { id } });
    }

    async update(id: number, data: UpdateOngPaymentUserConfigStateDto): Promise<OngPaymentUserConfigState> {
        return await this.opucsRepository.updateOPUCS({ where: { id } }, data);
    }

    async find(): Promise<OngPaymentUserConfigState[]> {
        return await this.opucsRepository.findOPUCS();
    }
}
