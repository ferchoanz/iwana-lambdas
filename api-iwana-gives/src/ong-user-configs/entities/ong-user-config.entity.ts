import { Ong } from 'src/ongs/entities/ong.entity';
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
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import moment from 'moment';

@Entity('ong_user_configs')
export class OngUserConfig {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Ong, { eager: false })
    @JoinColumn({ name: 'ong_id' })
    ong: Ong;

    @ManyToOne(() => User, (user) => user.ongUserConfig, { eager: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'int' })
    percent: number;

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
