import { forwardRef, Module } from '@nestjs/common';
import { UserAmountDonateService } from './services/user-amount-donate.service';
import { UserAmountDonateController } from './controllers/user-amount-donate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAmountDonate } from './entities/user-amount-donate.entity';
import { UserAmountDonateRepository } from './repositories/user-amount-donate.repository';
import { UserAmountDonateHistoryModule } from 'src/user-amount-donate-history/user-amount-donate-history.module';
import { IwanaCashApi } from './api/iwana-cash.api';
import { UserAmountDonateAdminController } from './controllers/user-amount-donate-admin.controller';
import { UserAmountDonateAdminService } from './services/user-amount-donate-admin.service';
import { OngUserConfigsModule } from 'src/ong-user-configs/ong-user-configs.module';
import { DesactivateDonationsService } from './services/desactivate-donations.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserAmountDonate]),
        UserAmountDonateHistoryModule,
        forwardRef(() => OngUserConfigsModule),
        UsersModule,
    ],
    controllers: [UserAmountDonateController, UserAmountDonateAdminController],
    providers: [
        UserAmountDonateService,
        UserAmountDonateRepository,
        IwanaCashApi,
        UserAmountDonateAdminService,
        DesactivateDonationsService,
    ],
    exports: [UserAmountDonateService, DesactivateDonationsService],
})
export class UserAmountDonateModule {}
