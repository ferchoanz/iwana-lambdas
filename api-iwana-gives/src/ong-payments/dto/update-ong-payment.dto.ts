import { IsNumber, IsOptional, IsString } from 'class-validator';
import { OngPaymentState } from 'src/ong-payment-states/entities/ong-payment-state.entity';

export class UpdateOngPaymentDto {
    @IsString()
    @IsOptional()
    code?: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    ongPaymentState?: number | OngPaymentState;
}
