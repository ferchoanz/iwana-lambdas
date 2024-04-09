import { User } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int4' })
    order_state_id: number;

    @Column({ type: 'numeric', precision: 11, scale: 2 })
    available: number;

    @Column({ type: 'numeric', array: true })
    gives_donation: number[];

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
