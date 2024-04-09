import { Injectable } from '@nestjs/common';
import { CreateOngPaymentUserConfigDto } from './dto/create-ong-payment-user-config.dto';
import { UpdateOngPaymentUserConfigDto } from './dto/update-ong-payment-user-config.dto';
import { OngPaymentUserConfig } from './entities/ong-payment-user-config.entity';
import { OngPaymentUserConfigRepository } from './repositories/ong-payment-user-config.repository';

@Injectable()
export class OngPaymentUserConfigsService {
    constructor(private readonly opucRepository: OngPaymentUserConfigRepository) {}

    async save(data: CreateOngPaymentUserConfigDto): Promise<OngPaymentUserConfig> {
        return await this.opucRepository.saveOPUC(data);
    }

    async findOne(id: number): Promise<OngPaymentUserConfig> {
        return await this.opucRepository.findOneOPUC({ where: { id } });
    }

    async update(id: number, data: UpdateOngPaymentUserConfigDto): Promise<OngPaymentUserConfig> {
        return await this.opucRepository.updateOPUC({ where: { id } }, data);
    }

    async updateManyStates(opId: number): Promise<boolean> {
        return await this.opucRepository.updateManyStates(opId);
    }

    async totalDotateByUser(userId: number): Promise<any> {
        return await this.opucRepository.getTotalDonateByUser(userId);
    }
}
