import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Ong } from 'src/ongs/entities/ong.entity';
import { User } from 'src/users/user.entity';

export class CreateOngUserConfigDto {
    @IsNumber()
    user: number | User;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Config)
    config: Config[];
}

class Config {
    @IsNumber()
    percent: number;

    @IsNumber()
    ong: number | Ong;
}
