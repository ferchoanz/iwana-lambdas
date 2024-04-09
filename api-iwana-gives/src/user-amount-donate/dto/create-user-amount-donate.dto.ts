import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { User } from 'src/users/user.entity';

export class CreateUserAmountDonateDto {
    @IsNumber()
    user: number | User;

    @IsNumber()
    percent: number;

    @IsBoolean()
    @IsOptional()
    is_active: boolean;
}
