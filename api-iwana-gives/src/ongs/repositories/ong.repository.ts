import { ICriteria } from '@digichanges/shared-experience';
import { Injectable } from '@nestjs/common';
import { isUndefined } from 'lodash';
import { OngCategory } from 'src/ong-categories/entities/ong-category.entity';
import CreateFilterHelper from 'src/shared/helpers/CreateSqlFilterHelper';
import { GenericError } from 'src/shared/helpers/generic-error';
import { Paginate } from 'src/shared/Paginate';
import { Paginator } from 'src/shared/Paginator';
import { DataSource, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { OngFilter } from '../criterias/ong.filter';
import { CreateOngDto } from '../dto/create-ong.dto';
import { UpdateOngDto } from '../dto/update-ong.dto';
import { Ong } from '../entities/ong.entity';

@Injectable()
export class OngRepository extends Repository<Ong> {
    constructor(private dataSource: DataSource) {
        super(Ong, dataSource.createEntityManager());
    }

    async saveOng(data: CreateOngDto): Promise<Ong> {
        const ong: Ong = this.create({ ...data, ongCategory: data.ong_category_id as OngCategory });

        return await this.save(ong);
    }

    async findOneOng(options: FindOneOptions<Ong>): Promise<Ong> {
        const ong: Ong = await this.findOne(options);

        if (!ong) {
            GenericError.throw(404, 'Ong not found', 'Not found');
        }

        return ong;
    }

    async updateOng(options: FindOneOptions<Ong>, data: UpdateOngDto): Promise<Ong> {
        const ong: Ong = await this.findOneOng(options);

        ong.brand = data.brand ? data.brand : ong.brand;
        ong.name = data.name ? data.name : ong.name;
        ong.is_active = !isUndefined(data.is_active) ? data.is_active : ong.is_active;
        ong.description = data.description ? data.description : ong.description;
        ong.ongCategory = data.ong_category_id ? (data.ong_category_id as OngCategory) : ong.ongCategory;
        ong.site_url = data.site_url ? data.site_url : ong.site_url;
        ong.data = data.data ?? ong.data;

        return await this.save(ong);
    }

    async findOngs(criteria: ICriteria): Promise<any> {
        const queryBuilder = this.createQueryBuilder('i').where('i.is_active = :isActive', { isActive: true });
        const filter = new CreateFilterHelper(criteria.getFilter(), queryBuilder);

        filter.createFilter(OngFilter.NAME, 'andWhere', 'ilike');
        filter.createFilter(OngFilter.BRAND, 'andWhere', 'ilike');

        filter.multiFilter(OngFilter.CATEGORY, 'andWhere', '=');

        const paginator = new Paginator(queryBuilder, criteria);
        return new Paginate(paginator).paginate();
    }

    async findOngsAdmin(criteria: ICriteria): Promise<any> {
        const queryBuilder = this.createQueryBuilder('i').where('1 = 1');
        const filter = new CreateFilterHelper(criteria.getFilter(), queryBuilder);

        filter.createFilter(OngFilter.NAME, 'andWhere', 'ilike');
        filter.createFilter(OngFilter.BRAND, 'andWhere', 'ilike');
        filter.createFilter(
            { attribute: OngFilter.IS_ACTIVE, dbAttribute: 'is_active', isBoolean: true },
            'andWhere',
            '=',
        );

        filter.multiFilter(OngFilter.CATEGORY, 'andWhere', '=');
        queryBuilder.innerJoinAndSelect('i.ongCategory', 'ongCategory');

        const paginator = new Paginator(queryBuilder, criteria);
        return new Paginate(paginator).paginate();
    }

    async softDeleteOng(options: FindOneOptions<Ong>): Promise<Ong> {
        const ong: Ong = await this.findOneOng(options);

        const updateResult = await this.softDelete({ id: ong.id });
        if (updateResult.affected === 0) {
            GenericError.throw(500, 'Failed to delete Ong');
        }

        return ong;
    }

    async findOngWithDonates(criteria: ICriteria): Promise<any> {
        const queryBuilder = this.createQueryBuilder('i').where('1 = 1');

        queryBuilder.select(['i', 'ouc.percent', 'user.name', 'user.email']);

        const filter = new CreateFilterHelper(criteria.getFilter(), queryBuilder);

        filter.createFilter(OngFilter.NAME, 'andWhere', 'ilike');
        filter.createFilter(OngFilter.BRAND, 'andWhere', 'ilike');
        filter.createFilter(
            { attribute: OngFilter.IS_ACTIVE, dbAttribute: 'is_active', isBoolean: true },
            'andWhere',
            '=',
        );

        queryBuilder.innerJoin('i.ongUserConfig', 'ouc');
        queryBuilder.innerJoin('ouc.user', 'user');

        queryBuilder.andWhere('ouc.percent > 0');

        const paginator = new Paginator(queryBuilder, criteria);
        return new Paginate(paginator).paginate();
    }

    async findAll(options: FindManyOptions<Ong>): Promise<Ong[]> {
        return await this.find(options);
    }

    async findAllWithDonates(ids: number[]): Promise<Ong[]> {
        const queryBuilder = this.createQueryBuilder('i')
            .innerJoin('i.ongUserConfig', 'ouc')
            .innerJoin('ouc.user', 'u')
            .innerJoin('u.userAmountDonate', 'uad')
            .where('i.is_active = :isActive', { isActive: true })
            .andWhere('uad.is_active = :isActive')
            .andWhere(`ouc.user_id IN (${ids})`);

        return await queryBuilder.getMany();
    }
}
