import { ICriteria } from '@digichanges/shared-experience';
import { Injectable } from '@nestjs/common';
import { isEmpty, isUndefined } from 'lodash';
import { OngPaymentHistoryService } from 'src/ong-payment-history/ong-payment-history.service';
import { OngPaymentStatesEnum } from 'src/ong-payment-states/enums/ong-payment-states.enum';
import { OngPaymentStatesService } from 'src/ong-payment-states/ong-payment-states.service';
import { OngPaymentUserConfigsService } from 'src/ong-payment-user-configs/ong-payment-user-configs.service';
import { OngsService } from 'src/ongs/services/ongs.service';
import { CreateOngPaymentDto } from './dto/create-ong-payment.dto';
import { UpdateOngPaymentDto } from './dto/update-ong-payment.dto';
import { OngPayment } from './entities/ong-payment.entity';
import { OngPaymentRepository } from './repositories/ong-payment.repository';

@Injectable()
export class OngPaymentsService {
    constructor(
        private readonly opRepository: OngPaymentRepository,
        private readonly ophService: OngPaymentHistoryService,
        private readonly opsService: OngPaymentStatesService,
        private readonly ongsService: OngsService,
        private readonly opucService: OngPaymentUserConfigsService,
    ) {}

    async save(data: CreateOngPaymentDto): Promise<OngPayment> {
        data.ongPaymentState = await this.opsService.findOneByName(OngPaymentStatesEnum.PENDING);
        data.ong = await this.ongsService.findOne(data.ong as number);
        const op: OngPayment = await this.opRepository.saveOngPayment(data);

        await this.ophService.save({ ongPayment: op, ongPaymentState: op.ongPaymentState });

        return op;
    }

    async findOne(id: number): Promise<OngPayment> {
        const ongPayment: OngPayment = await this.opRepository.findOneWithDetails(id);

        let amount = 0;

        ongPayment.ongPaymentUserConfig.forEach((opuc) => {
            amount += parseFloat(opuc.amount as any);
        });

        Object.assign(ongPayment, { amount });

        return ongPayment;
    }

    async update(id: number, data: UpdateOngPaymentDto): Promise<OngPayment> {
        if (!isUndefined(data.ongPaymentState)) {
            data.ongPaymentState = await this.opsService.findOne(data.ongPaymentState as number);
        }

        const op: OngPayment = await this.opRepository.updateOngPayment(
            { where: { id }, relations: ['ongPaymentState'] },
            data,
        );

        if (op.ongPaymentState.name === OngPaymentStatesEnum.PAID) {
            await this.opucService.updateManyStates(op.id);
        }

        await this.ophService.save({ ongPayment: op, ongPaymentState: op.ongPaymentState });

        return op;
    }

    async validateState(): Promise<boolean> {
        const payments: OngPayment[] = await this.opRepository.findOngPayment({
            select: {
                id: true,
            },
            where: [
                { ongPaymentState: { name: OngPaymentStatesEnum.PENDING } },
                { ongPaymentState: { name: OngPaymentStatesEnum.IN_PROGRESS } },
            ],
            relations: ['ongPaymentState'],
        });

        return isEmpty(payments) ? false : true;
    }

    async findAll(criteria: ICriteria): Promise<any> {
        return await this.opRepository.findAll(criteria);
    }
}
