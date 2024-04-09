import { ICriteria } from '@digichanges/shared-experience';
import { Injectable } from '@nestjs/common';
import { OngPaymentState } from 'src/ong-payment-states/entities/ong-payment-state.entity';
import { Ong } from 'src/ongs/entities/ong.entity';
import CreateFilterHelper from 'src/shared/helpers/CreateSqlFilterHelper';
import { GenericError } from 'src/shared/helpers/generic-error';
import { Paginate } from 'src/shared/Paginate';
import { Paginator } from 'src/shared/Paginator';
import { DataSource, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { OngPaymentFilter } from '../criterias/ong-payment.filter';
import { CreateOngPaymentDto } from '../dto/create-ong-payment.dto';
import { UpdateOngPaymentDto } from '../dto/update-ong-payment.dto';
import { OngPayment } from '../entities/ong-payment.entity';
import { SumAmountHelper } from '../helpers/sum-amount.helper';

@Injectable()
export class OngPaymentRepository extends Repository<OngPayment> {
    constructor(private dataSource: DataSource) {
        super(OngPayment, dataSource.createEntityManager());
    }

    async saveOngPayment(data: CreateOngPaymentDto): Promise<OngPayment> {
        const op: OngPayment = this.create({
            code: data.code,
            title: data.title,
            description: data.description ? data.description : null,
            ongPaymentState: data.ongPaymentState,
            ong: data.ong as Ong,
        });

        return await this.save(op);
    }

    async findOneOngPayment(options: FindOneOptions<OngPayment>): Promise<OngPayment> {
        const op: OngPayment = await this.findOne(options);

        if (!op) {
            GenericError.throw(404, 'OngPayment not found', 'Not found');
        }

        return op;
    }

    async findOneWithDetails(id: number): Promise<OngPayment> {
        const queryBuilder = this.createQueryBuilder('i').where('i.id = :id', { id });

        queryBuilder
            .select(['i.id', 'i.code', 'i.title', 'i.created_at', 'i.updated_at'])
            .addSelect(['o.id', 'o.name', 'o.brand', 'o.description', 'oc.name', 'o.data'])
            .addSelect(['opuc.amount', 'opuc.percent', 'opucs.id', 'opucs.name', 'ops.name', 'ops.id'])
            .addSelect(['ouc.id', 'u.id', 'u.name', 'u.email']);

        queryBuilder
            .innerJoin('i.ongPaymentState', 'ops')
            .innerJoin('i.ong', 'o')
            .innerJoin('o.ongCategory', 'oc')
            .innerJoin('i.ongPaymentUserConfig', 'opuc')
            .innerJoin('opuc.ongPaymentUserConfigState', 'opucs')
            .innerJoin('opuc.ongUserConfig', 'ouc')
            .innerJoin('ouc.user', 'u');

        return await queryBuilder.getOne();
    }

    async updateOngPayment(options: FindOneOptions<OngPayment>, data: UpdateOngPaymentDto): Promise<OngPayment> {
        const op: OngPayment = await this.findOneOngPayment(options);

        op.code = data.code ?? op.code;
        op.title = data.title ?? op.title;
        op.description = data.description ?? op.description;
        op.ongPaymentState = (data.ongPaymentState as OngPaymentState) ?? op.ongPaymentState;

        return await this.save(op);
    }

    async findOngPayment(options: FindManyOptions<OngPayment>): Promise<OngPayment[]> {
        const payments: OngPayment[] = await this.find(options);

        return payments;
    }

    async findAll(criteria: ICriteria): Promise<any> {
        const queryBuilder = this.createQueryBuilder('i').where('1 = 1');

        const filter = new CreateFilterHelper(criteria.getFilter(), queryBuilder);

        queryBuilder
            .select([
                'i.id',
                'i.code',
                'ops.id',
                'ops.name',
                'o.id',
                'o.name',
                'o.brand',
                'opuc.amount',
                'i.created_at',
                'i.updated_at',
            ])
            .innerJoin('i.ongPaymentState', 'ops')
            .innerJoin('i.ong', 'o')
            .innerJoin('i.ongPaymentUserConfig', 'opuc');

        filter.createFilter(OngPaymentFilter.STATE, 'andWhere', '=');

        await filter.search(
            OngPaymentFilter.SEARCH,
            {
                partialMatch: true,
                attributesDB: [{ name: 'name', setWeight: 'A', tableAlias: 'o' }],
            },
            'andWhere',
        );

        const paginator = new Paginator(queryBuilder, criteria, { helper: SumAmountHelper });
        return new Paginate(paginator).paginate();
    }
}
