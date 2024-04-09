import moment from 'moment';
import { OngPaymentState } from 'src/ong-payment-states/entities/ong-payment-state.entity';
import { OngPaymentUserConfig } from 'src/ong-payment-user-configs/entities/ong-payment-user-config.entity';
import { Ong } from 'src/ongs/entities/ong.entity';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('ong_payments')
export class OngPayment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    code: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @ManyToOne(() => OngPaymentState)
    @JoinColumn({ name: 'ong_payment_state_id' })
    ongPaymentState: OngPaymentState;

    @OneToMany(() => OngPaymentUserConfig, (opuc) => opuc.ongPayment)
    ongPaymentUserConfig: OngPaymentUserConfig[];

    @ManyToOne(() => Ong, { eager: false })
    @JoinColumn({ name: 'ong_id' })
    ong: Ong;

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
