import moment from 'moment';
import { User } from 'src/users/user.entity';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('user_amount_to_donate')
export class UserAmountDonate {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, { eager: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'int' })
    percent: number;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @BeforeInsert()
    generateFields() {
        this.created_at = moment().toDate();
        this.updated_at = moment().toDate();
    }

    @BeforeUpdate()
    updateFields() {
        this.updated_at = moment().toDate();
    }
}
