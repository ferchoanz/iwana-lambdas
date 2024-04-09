import { Injectable } from '@nestjs/common';
import { CreateOngPaymentHistoryDto } from './dto/create-ong-payment-history.dto';
import { OngPaymentHistory } from './entities/ong-payment-history.entity';
import { OngPaymentHistoryRepository } from './repositories/ong-payment-history.repository';

@Injectable()
export class OngPaymentHistoryService {
    constructor(private readonly ophRepository: OngPaymentHistoryRepository) {}

    async save(data: CreateOngPaymentHistoryDto): Promise<OngPaymentHistory> {
        return await this.ophRepository.saveOPH(data);
    }

    async findOne(id: number): Promise<OngPaymentHistory> {
        return await this.ophRepository.findOneOPH({ where: { id } });
    }
}
