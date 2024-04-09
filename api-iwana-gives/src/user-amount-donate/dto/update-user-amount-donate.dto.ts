import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateUserAmountDonateDto {
    @IsNumber()
    percent: number;

    @IsBoolean()
    is_active: boolean;
}
