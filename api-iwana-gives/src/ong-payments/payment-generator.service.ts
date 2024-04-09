import { Injectable } from '@nestjs/common';
import { isEmpty, isNull } from 'lodash';
import { CreateOngPaymentHistoryDto } from 'src/ong-payment-history/dto/create-ong-payment-history.dto';
import { OngPaymentHistory } from 'src/ong-payment-history/entities/ong-payment-history.entity';
import { OngPaymentState } from 'src/ong-payment-states/entities/ong-payment-state.entity';
import { OngPaymentStatesEnum } from 'src/ong-payment-states/enums/ong-payment-states.enum';
import { OngPaymentStatesService } from 'src/ong-payment-states/ong-payment-states.service';
import { OngPaymentUserConfigState } from 'src/ong-payment-user-config-state/entities/ong-payment-user-config-state.entity';
import { OngPaymentUserConfigStateService } from 'src/ong-payment-user-config-state/ong-payment-user-config-state.service';
import { OngPayment } from 'src/ong-payments/entities/ong-payment.entity';
import { OngUserConfig } from 'src/ong-user-configs/entities/ong-user-config.entity';
import { OngUserConfigsService } from 'src/ong-user-configs/ong-user-configs.service';
import { Ong } from 'src/ongs/entities/ong.entity';
import { OngsService } from 'src/ongs/services/ongs.service';
import { Order } from 'src/orders/entities/order.entity';
import { OrdersService } from 'src/orders/services/orders.service';
import { GenericError } from 'src/shared/helpers/generic-error';
import { UserAmountDonate } from 'src/user-amount-donate/entities/user-amount-donate.entity';
import { UserAmountDonateService } from 'src/user-amount-donate/services/user-amount-donate.service';
import { DataSource } from 'typeorm';
import { CreateOngPaymentUserConfigDto } from '../ong-payment-user-configs/dto/create-ong-payment-user-config.dto';
import { OngPaymentUserConfig } from '../ong-payment-user-configs/entities/ong-payment-user-config.entity';
import { CreateOngPaymentDto } from './dto/create-ong-payment.dto';
import { OngPaymentsService } from './ong-payments.service';

@Injectable()
export class PaymentGeneratorService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly oucService: OngUserConfigsService,
        private readonly opucsService: OngPaymentUserConfigStateService,
        private readonly ordersService: OrdersService,
        private readonly uadService: UserAmountDonateService,
        private readonly ongsService: OngsService,
        private readonly opsService: OngPaymentStatesService,
        private readonly opService: OngPaymentsService,
    ) {}

    async paymentGenerator(): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        await queryRunner.startTransaction();

        if (await this.opService.validateState()) {
            GenericError.throw(422, 'There are payments pending or in progress', 'Unprocessable Entity');
        }

        try {
            // execute some operations on this transaction:
            const userIds: number[] = await this.oucService.getReadyToPayByUser();
            const ongs: Ong[] = await this.ongsService.findWithDonations(userIds);
            if (isEmpty(ongs)) {
                GenericError.throw(422, 'There are no organizations with donations', 'Unprocessable Entity');
            }
            const ops: OngPaymentState = await this.opsService.findOneByName(OngPaymentStatesEnum.PENDING);
            for await (const ong of ongs) {
                let ongPayment = this.createOngPayment({
                    ongPaymentState: ops,
                    ong,
                    title: 'Donaciones',
                });

                ongPayment = await queryRunner.manager.save(ongPayment);

                const oph: OngPaymentHistory = this.createOngPaymentHistory({ ongPayment, ongPaymentState: ops });

                await queryRunner.manager.save(oph);

                // TODO: Find opucs by name
                const opucs: OngPaymentUserConfigState = await this.opucsService.findOne(1);

                const ouc: OngUserConfig[] = await this.oucService.findAllToPay(ongPayment.ong.id, userIds);

                for await (const item of ouc) {
                    const amountAvailable = (await this.ordersService.getAvailableByUser(item.user.id)).total;

                    if (amountAvailable > 0) {
                        const uad: UserAmountDonate = await this.uadService.findOneByUser(item.user.id);
                        const amountDonate = amountAvailable * (uad.percent / 100);

                        const opuc = this.createOPUC({
                            ongPayment,
                            amount: amountDonate * (item.percent / 100),
                            percent: item.percent,
                            ongUserConfig: item,
                            ongPaymentUserConfigState: opucs,
                        });

                        await queryRunner.manager.save(opuc);
                    }
                }
            }
            const uadActives: UserAmountDonate[] = await this.uadService.findAllActives();

            for await (const uad of uadActives) {
                const orders: Order[] = await this.ordersService.getOrdersByUser(uad.user.id);

                for await (const order of orders) {
                    if (isNull(order.gives_donation)) {
                        order.gives_donation = [];
                    }

                    const reduce = order.gives_donation.reduce((accumulator, value) => {
                        return accumulator + value;
                    }, 0);

                    order.gives_donation.push((order.available - reduce) * (uad.percent / 100));

                    await queryRunner.manager.save(order);
                }
            }

            // commit transaction now:
            await queryRunner.commitTransaction();
        } catch (err) {
            // since we have errors let's rollback changes we made
            console.log(err);
            const { statusCode, message, error } = err.response;
            await queryRunner.rollbackTransaction();
            GenericError.throw(statusCode ?? null, message ?? null, error ?? null);
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }

        return { message: 'Payment generated successfully' };
    }

    private createOPUC(data: CreateOngPaymentUserConfigDto): OngPaymentUserConfig {
        const opuc = new OngPaymentUserConfig();

        opuc.percent = data.percent;
        opuc.amount = data.amount;
        opuc.ongPayment = data.ongPayment;
        opuc.ongPaymentUserConfigState = data.ongPaymentUserConfigState;
        opuc.ongUserConfig = data.ongUserConfig;

        return opuc;
    }

    private createOngPayment(data: CreateOngPaymentDto): OngPayment {
        const op = new OngPayment();

        op.title = data.title;
        op.code = data.code;
        op.ong = data.ong as Ong;
        op.ongPaymentState = data.ongPaymentState;

        return op;
    }

    private createOngPaymentHistory(data: CreateOngPaymentHistoryDto): OngPaymentHistory {
        const oph = new OngPaymentHistory();

        oph.ongPayment = data.ongPayment;
        oph.ongPaymentState = data.ongPaymentState;

        return oph;
    }
}
