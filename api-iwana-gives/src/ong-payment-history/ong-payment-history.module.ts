import { Module } from '@nestjs/common';
import { OngPaymentHistoryService } from './ong-payment-history.service';
import { OngPaymentHistoryController } from './ong-payment-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OngPaymentHistory } from './entities/ong-payment-history.entity';
import { OngPaymentHistoryRepository } from './repositories/ong-payment-history.repository';

@Module({
    imports: [TypeOrmModule.forFeature([OngPaymentHistory])],
    controllers: [OngPaymentHistoryController],
    providers: [OngPaymentHistoryService, OngPaymentHistoryRepository],
    exports: [OngPaymentHistoryService],
})
export class OngPaymentHistoryModule {}
