import { Module } from '@nestjs/common';
import { OngPaymentsService } from './ong-payments.service';
import { OngPaymentsController } from './ong-payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OngPayment } from './entities/ong-payment.entity';
import { OngPaymentRepository } from './repositories/ong-payment.repository';
import { OngPaymentHistoryModule } from 'src/ong-payment-history/ong-payment-history.module';
import { OngPaymentStatesModule } from 'src/ong-payment-states/ong-payment-states.module';
import { OngsModule } from 'src/ongs/ongs.module';
import { PaymentGeneratorService } from './payment-generator.service';
import { OngUserConfigsModule } from 'src/ong-user-configs/ong-user-configs.module';
import { OngPaymentUserConfigStateModule } from 'src/ong-payment-user-config-state/ong-payment-user-config-state.module';
import { OrdersModule } from 'src/orders/orders.module';
import { UserAmountDonateModule } from 'src/user-amount-donate/user-amount-donate.module';
import { OngPaymentUserConfigsModule } from 'src/ong-payment-user-configs/ong-payment-user-configs.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([OngPayment]),
        OngPaymentHistoryModule,
        OngPaymentStatesModule,
        OngPaymentUserConfigStateModule,
        OngsModule,
        OngUserConfigsModule,
        OrdersModule,
        UserAmountDonateModule,
        OngPaymentUserConfigsModule,
    ],
    controllers: [OngPaymentsController],
    providers: [OngPaymentsService, OngPaymentRepository, PaymentGeneratorService],
})
export class OngPaymentsModule {}
