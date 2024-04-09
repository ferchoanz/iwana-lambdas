import { ICriteria } from '@digichanges/shared-experience';
import { Injectable } from '@nestjs/common';
import { CreateOngUserConfigHistoryDto } from './dto/create-ong-user-config-history.dto';
import { OngUserConfigHistory } from './entities/ong-user-config-history.entity';
import { OngUserConfigHistoryRepository } from './repositories/ong-user-config-history.repository';

@Injectable()
export class OngUserConfigHistoriesService {
    constructor(private readonly ongUserConfigHistoryRepository: OngUserConfigHistoryRepository) {}

    async save(data: CreateOngUserConfigHistoryDto): Promise<OngUserConfigHistory> {
        return await this.ongUserConfigHistoryRepository.saveOUCH(data);
    }

    async saveMany(data: CreateOngUserConfigHistoryDto[]): Promise<OngUserConfigHistory[]> {
        return await this.ongUserConfigHistoryRepository.saveMany(data);
    }

    async findOne(id: number): Promise<OngUserConfigHistory> {
        return await this.ongUserConfigHistoryRepository.findOneOUCH({ where: { id } });
    }

    async findAll(criteria: ICriteria): Promise<any> {
        return await this.ongUserConfigHistoryRepository.findAll(criteria);
    }
}
