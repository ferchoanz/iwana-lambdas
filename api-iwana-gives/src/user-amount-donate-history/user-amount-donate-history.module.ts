import { Module } from '@nestjs/common';
import { UserAmountDonateHistoryService } from './user-amount-donate-history.service';
import { UserAmountDonateHistoryController } from './user-amount-donate-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAmountDonateHistory } from './entities/user-amount-donate-history.entity';
import { UserAmountDonateHistoryRepository } from './repositories/user-amount-donate-history.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UserAmountDonateHistory])],
    controllers: [UserAmountDonateHistoryController],
    providers: [UserAmountDonateHistoryService, UserAmountDonateHistoryRepository],
    exports: [UserAmountDonateHistoryService],
})
export class UserAmountDonateHistoryModule {}
