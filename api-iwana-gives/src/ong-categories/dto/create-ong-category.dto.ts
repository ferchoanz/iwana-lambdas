import { IsOptional, IsString } from 'class-validator';

export class CreateOngCategoryDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;
}
