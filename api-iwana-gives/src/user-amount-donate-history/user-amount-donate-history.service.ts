import { ICriteria } from '@digichanges/shared-experience';
import { Injectable } from '@nestjs/common';
import { CreateUserAmountDonateHistoryDto } from './dto/create-user-amount-donate-history.dto';
import { UserAmountDonateHistory } from './entities/user-amount-donate-history.entity';
import { UserAmountDonateHistoryRepository } from './repositories/user-amount-donate-history.repository';

@Injectable()
export class UserAmountDonateHistoryService {
    constructor(private readonly uadhRepository: UserAmountDonateHistoryRepository) {}

    async save(data: CreateUserAmountDonateHistoryDto): Promise<UserAmountDonateHistory> {
        return await this.uadhRepository.saveUADH(data);
    }

    async findOne(id: number): Promise<UserAmountDonateHistory> {
        return await this.uadhRepository.findOneUADH({ where: { id } });
    }

    async findOneLastReserved(): Promise<UserAmountDonateHistory> {
        return await this.uadhRepository.findOneLastReserved();
    }

    async find(criteria: ICriteria, uadId: number): Promise<any> {
        return await this.uadhRepository.findUADH(criteria, uadId);
    }
}
