import { IsOptional, IsString } from 'class-validator';

export class CreateOngPaymentUserConfigStateDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;
}
