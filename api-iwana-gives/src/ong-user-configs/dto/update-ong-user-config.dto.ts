import { IsNumber } from 'class-validator';

export class UpdateOngUserConfigDto {
    @IsNumber()
    percent: number;
}
