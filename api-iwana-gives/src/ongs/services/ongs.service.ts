import { ICriteria } from '@digichanges/shared-experience';
import { Injectable } from '@nestjs/common';
import { Ong } from '../entities/ong.entity';
import { OngRepository } from '../repositories/ong.repository';

@Injectable()
export class OngsService {
    constructor(private readonly ongRepository: OngRepository) {}

    async findOne(id: number): Promise<Ong> {
        return await this.ongRepository.findOneOng({ where: { id, is_active: true } });
    }

    async findAll(criteria: ICriteria): Promise<any> {
        return await this.ongRepository.findOngs(criteria);
    }

    async findWithDonations(ids: number[]): Promise<Ong[]> {
        return await this.ongRepository.findAllWithDonates(ids);
    }
}
