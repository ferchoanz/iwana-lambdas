import { Module } from '@nestjs/common';
import { OngPaymentUserConfigStateService } from './ong-payment-user-config-state.service';
import { OngPaymentUserConfigStateController } from './ong-payment-user-config-state.controller';
import { OngPaymentUserConfigStateRepository } from './repositories/ong-payment-user-config-state.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OngPaymentUserConfigState } from './entities/ong-payment-user-config-state.entity';

@Module({
    imports: [TypeOrmModule.forFeature([OngPaymentUserConfigState])],
    controllers: [OngPaymentUserConfigStateController],
    providers: [OngPaymentUserConfigStateService, OngPaymentUserConfigStateRepository],
    exports: [OngPaymentUserConfigStateService],
})
export class OngPaymentUserConfigStateModule {}
