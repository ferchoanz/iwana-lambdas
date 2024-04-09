import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderRepository extends Repository<Order> {
    constructor(private dataSource: DataSource) {
        super(Order, dataSource.createEntityManager());
    }

    async getAvailableByUser(userId: number): Promise<{ total: number }> {
        const queryBuilder = this.createQueryBuilder('i')
            .select(
                'SUM(i.available) as "available", SUM((SELECT SUM(donations) FROM UNNEST(i.gives_donation) AS donations)) as "discount"',
            )
            .where('i.order_state_id = 4')
            .andWhere('i.user_id = :userId', { userId });

        const { available, discount } = await queryBuilder.getRawOne();

        return { total: (available ? parseFloat(available) : 0) - (discount ? parseFloat(discount) : 0) };
    }

    async setDiscount(id: number, discount: number): Promise<any> {
        const queryBuilder = this.createQueryBuilder('i')
            .update()
            .set({
                gives_donation: () => `array_append(gives_donation, ${discount})`,
            })
            .where('id = :id', { id });

        console.log(queryBuilder.getQueryAndParameters());

        return false;
    }

    async getOrdersByUser(userId: number): Promise<Order[]> {
        return await this.find({ where: { user: { id: userId }, order_state_id: 4 } });
    }

    async test() {
        const order = await this.findOne({ where: { id: 21874 } });

        const reduce = order.gives_donation.reduce((accumulator, value) => {
            return accumulator + value;
        }, 0);

        order.gives_donation.push((order.available - reduce) * (50 / 100));
        const a = await this.save(order);
        return a;
    }
}
