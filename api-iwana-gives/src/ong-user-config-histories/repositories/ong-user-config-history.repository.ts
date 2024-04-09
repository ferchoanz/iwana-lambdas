import { ICriteria } from '@digichanges/shared-experience';
import { Injectable } from '@nestjs/common';
import CreateFilterHelper from 'src/shared/helpers/CreateSqlFilterHelper';
import { GenericError } from 'src/shared/helpers/generic-error';
import { Paginate } from 'src/shared/Paginate';
import { Paginator } from 'src/shared/Paginator';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { OngUserConfigHistoryFilter } from '../criterias/ong-user-config-history.filter';
import { CreateOngUserConfigHistoryDto } from '../dto/create-ong-user-config-history.dto';
import { OngUserConfigHistory } from '../entities/ong-user-config-history.entity';

@Injectable()
export class OngUserConfigHistoryRepository extends Repository<OngUserConfigHistory> {
    constructor(private dataSource: DataSource) {
        super(OngUserConfigHistory, dataSource.createEntityManager());
    }

    async saveOUCH(data: CreateOngUserConfigHistoryDto): Promise<OngUserConfigHistory> {
        const ouch: OngUserConfigHistory = this.create({
            ongUserConfig: data.ongUserConfig,
            percent: data.percent,
        });

        return await this.save(ouch);
    }

    async saveMany(data: CreateOngUserConfigHistoryDto[]): Promise<OngUserConfigHistory[]> {
        const ouchArray: OngUserConfigHistory[] = data.map((ouch) => {
            return this.create({
                ongUserConfig: ouch.ongUserConfig,
                percent: ouch.percent,
            });
        });

        return await this.save(ouchArray);
    }

    async findOneOUCH(options: FindOneOptions<OngUserConfigHistory>): Promise<OngUserConfigHistory> {
        const ouch: OngUserConfigHistory = await this.findOne(options);

        if (!ouch) {
            GenericError.throw(404, 'OngUserConfigHistory not found', 'Not found');
        }

        return ouch;
    }

    async findAll(criteria: ICriteria): Promise<any> {
        const queryBuilder = this.createQueryBuilder('i').where('1 = 1');
        const filter = new CreateFilterHelper(criteria.getFilter(), queryBuilder);

        filter.createFilter(OngUserConfigHistoryFilter.ONG_USER_CONFIG, 'andWhere', '=');
        filter.createFilter(OngUserConfigHistoryFilter.PERCENT, 'andWhere', '=');

        const paginator = new Paginator(queryBuilder, criteria);
        return new Paginate(paginator).paginate();
    }
}
