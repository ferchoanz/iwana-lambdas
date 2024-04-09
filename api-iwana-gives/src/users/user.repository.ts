import { GenericError } from 'src/shared/helpers/generic-error';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';
import { OngPayment } from 'src/ong-payments/entities/ong-payment.entity';

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findOneUser(options: FindOneOptions<User>): Promise<User> {
        const user: User = await this.findOne(options);

        if (!user) {
            GenericError.throw(404, 'User not found', 'Not found');
        }

        return user;
    }

    async inPayment(userId: number): Promise<User> {
        const queryBuilder = this.createQueryBuilder('i')
            .innerJoin('i.ongUserConfig', 'ouc')
            .innerJoin(OngPayment, 'op', 'ouc.ong_id = op.ong_id')
            .innerJoin('op.ongPaymentState', 'ops')
            .where('i.id = :userId', { userId });

        queryBuilder.andWhere('op.ong_payment_state_id = 1').orWhere('op.ong_payment_state_id = 2');

        return await queryBuilder.getOne();
    }
}
