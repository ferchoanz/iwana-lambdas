import moment from 'moment';
import { OngPaymentUserConfigState } from 'src/ong-payment-user-config-state/entities/ong-payment-user-config-state.entity';
import { OngPayment } from 'src/ong-payments/entities/ong-payment.entity';
import { OngUserConfig } from 'src/ong-user-configs/entities/ong-user-config.entity';
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

@Entity('ong_payment_user_configs')
export class OngPaymentUserConfig {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    percent: number;

    @Column({ type: 'numeric', precision: 8, scale: 2 })
    amount: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => OngUserConfig, { eager: false })
    @JoinColumn({ name: 'ong_user_config_id' })
    ongUserConfig: OngUserConfig;

    @ManyToOne(() => OngPaymentUserConfigState)
    @JoinColumn({ name: 'ong_payment_user_config_state_id' })
    ongPaymentUserConfigState: OngPaymentUserConfigState;

    @ManyToOne(() => OngPayment, { eager: false })
    @JoinColumn({ name: 'ong_payment_id' })
    ongPayment: OngPayment;

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
