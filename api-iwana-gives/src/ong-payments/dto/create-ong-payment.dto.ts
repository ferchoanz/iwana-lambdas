import { IsNumber, IsOptional, IsString } from 'class-validator';
import { OngPaymentState } from 'src/ong-payment-states/entities/ong-payment-state.entity';
import { Ong } from 'src/ongs/entities/ong.entity';

export class CreateOngPaymentDto {
    @IsString()
    @IsOptional()
    code?: string;

    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    ong: number | Ong;

    ongPaymentState: OngPaymentState;
}
