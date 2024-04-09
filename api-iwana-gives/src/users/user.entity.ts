import { OngUserConfig } from 'src/ong-user-configs/entities/ong-user-config.entity';
import { UserAmountDonate } from 'src/user-amount-donate/entities/user-amount-donate.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @OneToMany(() => OngUserConfig, (ouc) => ouc.user)
    ongUserConfig: OngUserConfig[];

    @OneToOne(() => UserAmountDonate, (uad) => uad.user)
    userAmountDonate: UserAmountDonate;
}
