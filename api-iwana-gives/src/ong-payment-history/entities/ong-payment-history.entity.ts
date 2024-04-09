import moment from 'moment';
import { OngPaymentState } from 'src/ong-payment-states/entities/ong-payment-state.entity';
import { OngPayment } from 'src/ong-payments/entities/ong-payment.entity';
import {
    BeforeInsert,
    BeforeUpdate,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('ong_payment_history')
export class OngPaymentHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => OngPayment)
    @JoinColumn({ name: 'ong_payment_id' })
    ongPayment: OngPayment;

    @ManyToOne(() => OngPaymentState)
    @JoinColumn({ name: 'ong_payment_state_id' })
    ongPaymentState: OngPaymentState;

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
