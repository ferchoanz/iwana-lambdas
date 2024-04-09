import { Injectable } from '@nestjs/common';
import { CreateOngPaymentStateDto } from './dto/create-ong-payment-state.dto';
import { UpdateOngPaymentStateDto } from './dto/update-ong-payment-state.dto';
import { OngPaymentState } from './entities/ong-payment-state.entity';
import { OngPaymentStatesEnum } from './enums/ong-payment-states.enum';
import { OngPaymentStateRespository } from './repositories/ong-payment-state.repository';

@Injectable()
export class OngPaymentStatesService {
    constructor(private readonly opsRepository: OngPaymentStateRespository) {}

    async save(data: CreateOngPaymentStateDto): Promise<OngPaymentState> {
        return await this.opsRepository.saveOPS(data);
    }

    async findOne(id: number): Promise<OngPaymentState> {
        return await this.opsRepository.findOneOPS({ where: { id } });
    }

    async findOneByName(name: OngPaymentStatesEnum): Promise<OngPaymentState> {
        return await this.opsRepository.findOneOPS({ where: { name } });
    }

    async update(id: number, data: UpdateOngPaymentStateDto): Promise<OngPaymentState> {
        return await this.opsRepository.updateOPS({ where: { id } }, data);
    }

    async find(): Promise<OngPaymentState[]> {
        return await this.opsRepository.findOPS();
    }
}
