import { ICriteria } from '@digichanges/shared-experience';
import { Injectable } from '@nestjs/common';
import CreateFilterHelper from 'src/shared/helpers/CreateSqlFilterHelper';
import { GenericError } from 'src/shared/helpers/generic-error';
import { Paginate } from 'src/shared/Paginate';
import { Paginator } from 'src/shared/Paginator';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { OngCategoryFilter } from '../criterias/ong-category.filter';
import { CreateOngCategoryDto } from '../dto/create-ong-category.dto';
import { UpdateOngCategoryDto } from '../dto/update-ong-category.dto';
import { OngCategory } from '../entities/ong-category.entity';

@Injectable()
export class OngCategoryRepository extends Repository<OngCategory> {
    constructor(private dataSource: DataSource) {
        super(OngCategory, dataSource.createEntityManager());
    }

    async saveOC(data: CreateOngCategoryDto): Promise<OngCategory> {
        const oc: OngCategory = this.create(data);

        return await this.save(oc);
    }

    async findOneOC(options: FindOneOptions<OngCategory>): Promise<OngCategory> {
        const oc: OngCategory = await this.findOne(options);

        if (!oc) {
            GenericError.throw(404, `OngCategory not found`, 'Not found');
        }

        return oc;
    }

    async updateOC(options: FindOneOptions<OngCategory>, data: UpdateOngCategoryDto): Promise<OngCategory> {
        const oc: OngCategory = await this.findOneOC(options);

        oc.name = data.name ? data.name : oc.name;
        oc.description = data.description ? data.description : oc.description;

        return await this.save(oc);
    }

    async findAll(criteria: ICriteria): Promise<any> {
        const queryBuilder = this.createQueryBuilder('i').where('1 = 1');
        const filter = new CreateFilterHelper(criteria.getFilter(), queryBuilder);

        filter.createFilter(OngCategoryFilter.NAME, 'andWhere', 'ilike');

        const paginator = new Paginator(queryBuilder, criteria);
        return new Paginate(paginator).paginate();
    }

    async softDeleteOC(options: FindOneOptions<OngCategory>): Promise<OngCategory> {
        const oc: OngCategory = await this.findOneOC(options);

        const updateResult = await this.softDelete({ id: oc.id });
        if (updateResult.affected === 0) {
            GenericError.throw(500, 'Failed to delete OngCategory');
        }

        return oc;
    }
}
