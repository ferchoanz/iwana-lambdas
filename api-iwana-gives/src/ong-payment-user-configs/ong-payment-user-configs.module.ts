import { Module } from '@nestjs/common';
import { OngPaymentUserConfigsService } from './ong-payment-user-configs.service';
import { OngPaymentUserConfigsController } from './ong-payment-user-configs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OngPaymentUserConfig } from './entities/ong-payment-user-config.entity';
import { OngPaymentUserConfigRepository } from './repositories/ong-payment-user-config.repository';

@Module({
    imports: [TypeOrmModule.forFeature([OngPaymentUserConfig])],
    controllers: [OngPaymentUserConfigsController],
    providers: [OngPaymentUserConfigsService, OngPaymentUserConfigRepository],
    exports: [OngPaymentUserConfigsService],
})
export class OngPaymentUserConfigsModule {}
