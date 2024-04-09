import { OngUserConfig } from 'src/ong-user-configs/entities/ong-user-config.entity';

export class CreateOngUserConfigHistoryDto {
    ongUserConfig: OngUserConfig;

    percent: number;
}
