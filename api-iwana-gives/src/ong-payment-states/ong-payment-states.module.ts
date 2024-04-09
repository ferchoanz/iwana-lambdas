import { Module } from '@nestjs/common';
import { OngPaymentStatesService } from './ong-payment-states.service';
import { OngPaymentStatesController } from './ong-payment-states.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OngPaymentState } from './entities/ong-payment-state.entity';
import { OngPaymentStateRespository } from './repositories/ong-payment-state.repository';

@Module({
    imports: [TypeOrmModule.forFeature([OngPaymentState])],
    controllers: [OngPaymentStatesController],
    providers: [OngPaymentStatesService, OngPaymentStateRespository],
    exports: [OngPaymentStatesService],
})
export class OngPaymentStatesModule {}
