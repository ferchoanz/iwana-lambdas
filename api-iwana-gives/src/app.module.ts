import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config/config';
import { DatabaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { OngsModule } from './ongs/ongs.module';
import { OngUserConfigsModule } from './ong-user-configs/ong-user-configs.module';
import { OngUserConfigHistoriesModule } from './ong-user-config-histories/ong-user-config-histories.module';
import { UserAmountDonateModule } from './user-amount-donate/user-amount-donate.module';
import { OngPaymentUserConfigStateModule } from './ong-payment-user-config-state/ong-payment-user-config-state.module';
import { OngPaymentUserConfigsModule } from './ong-payment-user-configs/ong-payment-user-configs.module';
import { OngPaymentsModule } from './ong-payments/ong-payments.module';
import { OngPaymentStatesModule } from './ong-payment-states/ong-payment-states.module';
import { OngPaymentHistoryModule } from './ong-payment-history/ong-payment-history.module';
import { UserAmountDonateHistoryModule } from './user-amount-donate-history/user-amount-donate-history.module';
import { OngCategoriesModule } from './ong-categories/ong-categories.module';
import { EmailsModule } from './emails/emails.module';
import { OrdersModule } from './orders/orders.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: DatabaseConfig,
        }),
        UsersModule,
        OngsModule,
        OngUserConfigsModule,
        OngUserConfigHistoriesModule,
        UserAmountDonateModule,
        OngPaymentUserConfigStateModule,
        OngPaymentUserConfigsModule,
        OngPaymentsModule,
        OngPaymentStatesModule,
        OngPaymentHistoryModule,
        UserAmountDonateHistoryModule,
        OngCategoriesModule,
        EmailsModule,
        OrdersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
