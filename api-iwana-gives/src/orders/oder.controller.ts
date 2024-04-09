import { Controller, Get } from '@nestjs/common';
import { OrdersService } from './services/orders.service';

@Controller('orders')
export class OrderController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get('available')
    getAvailable() {
        return this.ordersService.getAvailableByUser(54);
    }
}
