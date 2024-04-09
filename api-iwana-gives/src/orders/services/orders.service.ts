import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';

@Injectable()
export class OrdersService {
    constructor(private readonly orderRepository: OrderRepository) {}

    async getAvailableByUser(userId: number): Promise<{ total: number }> {
        return await this.orderRepository.getAvailableByUser(userId);
    }

    async getOrdersByUser(userId: number): Promise<Order[]> {
        return await this.orderRepository.getOrdersByUser(userId);
    }
}
