import { IsString } from 'class-validator';

export class CreateOngPaymentStateDto {
    @IsString()
    name: string;

    @IsString()
    description?: string;
}
