import { ICriteria } from '@digichanges/shared-experience';
import { Injectable } from '@nestjs/common';
import { OngCategory } from '../entities/ong-category.entity';
import { OngCategoryRepository } from '../respositories/ong-category.repository';

@Injectable()
export class OngCategoriesService {
    constructor(private readonly ocRepository: OngCategoryRepository) {}

    async findOne(id: number): Promise<OngCategory> {
        return await this.ocRepository.findOneOC({ where: { id } });
    }

    async findAll(criteria: ICriteria): Promise<any> {
        return await this.ocRepository.findAll(criteria);
    }
}
