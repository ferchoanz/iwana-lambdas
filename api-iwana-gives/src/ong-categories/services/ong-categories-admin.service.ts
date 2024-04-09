import { ICriteria } from '@digichanges/shared-experience';
import { Injectable } from '@nestjs/common';
import { CreateOngCategoryDto } from '../dto/create-ong-category.dto';
import { UpdateOngCategoryDto } from '../dto/update-ong-category.dto';
import { OngCategory } from '../entities/ong-category.entity';
import { OngCategoryRepository } from '../respositories/ong-category.repository';

@Injectable()
export class OngCategoriesAdminService {
    constructor(private readonly ocRepository: OngCategoryRepository) {}

    async save(data: CreateOngCategoryDto): Promise<OngCategory> {
        return await this.ocRepository.saveOC(data);
    }

    async findOne(id: number): Promise<OngCategory> {
        return await this.ocRepository.findOneOC({ where: { id } });
    }

    async update(id: number, data: UpdateOngCategoryDto): Promise<OngCategory> {
        return await this.ocRepository.updateOC({ where: { id } }, data);
    }

    async findAll(criteria: ICriteria): Promise<any> {
        return await this.ocRepository.findAll(criteria);
    }

    async softDelete(id: number): Promise<OngCategory> {
        return await this.ocRepository.softDeleteOC({ where: { id } });
    }
}
