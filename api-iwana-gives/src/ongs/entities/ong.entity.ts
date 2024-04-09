import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import moment from 'moment';
import { OngCategory } from 'src/ong-categories/entities/ong-category.entity';
import { OngUserConfig } from 'src/ong-user-configs/entities/ong-user-config.entity';

@Entity('ongs')
export class Ong {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    brand: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @Column({ type: 'text', nullable: true })
    site_url: string;

    @ManyToOne(() => OngCategory)
    @JoinColumn({ name: 'ong_category_id' })
    ongCategory: OngCategory;

    @OneToMany(() => OngUserConfig, (ouc) => ouc.ong, { eager: false })
    ongUserConfig: OngUserConfig[];

    @Column({ type: 'json' })
    data: JSON;

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
