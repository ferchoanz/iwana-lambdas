import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderController } from './oder.controller';
import { OrderRepository } from './repositories/order.repository';
import { OrdersService } from './services/orders.service';

@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    providers: [OrderRepository, OrdersService],
    controllers: [OrderController],
    exports: [OrdersService],
})
export class OrdersModule {}
