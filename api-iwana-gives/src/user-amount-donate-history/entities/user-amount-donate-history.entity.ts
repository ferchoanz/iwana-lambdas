import moment from 'moment';
import { UserAmountDonate } from 'src/user-amount-donate/entities/user-amount-donate.entity';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('user_amount_to_donate_history')
export class UserAmountDonateHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    percent: number;

    @Column({ type: 'boolean', default: false })
    reserved: boolean;

    @ManyToOne(() => UserAmountDonate, { eager: false })
    @JoinColumn({ name: 'user_amount_to_donate_id' })
    userAmountDonate: UserAmountDonate;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

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
