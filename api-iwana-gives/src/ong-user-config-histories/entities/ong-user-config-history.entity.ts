import moment from 'moment';
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

@Entity('ong_user_config_history')
export class OngUserConfigHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => OngUserConfig, { eager: false })
    @JoinColumn({ name: 'ong_user_config_id' })
    ongUserConfig: OngUserConfig;

    @Column({ type: 'int' })
    percent: number;

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
