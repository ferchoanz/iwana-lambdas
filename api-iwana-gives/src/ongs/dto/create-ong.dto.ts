import { IsString, IsBoolean, IsOptional, IsNumber, IsJSON } from 'class-validator';
import { OngCategory } from 'src/ong-categories/entities/ong-category.entity';

export class CreateOngDto {
    @IsString()
    brand: string;

    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;

    @IsNumber()
    ong_category_id: number | OngCategory;

    @IsString()
    @IsOptional()
    site_url?: string;

    @IsOptional()
    data?: any;
}
