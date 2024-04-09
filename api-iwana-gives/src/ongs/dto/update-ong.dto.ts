import { IsString, IsOptional, IsBoolean, IsNumber, IsJSON } from 'class-validator';
import { OngCategory } from 'src/ong-categories/entities/ong-category.entity';

export class UpdateOngDto {
    @IsString()
    @IsOptional()
    brand?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;

    @IsNumber()
    @IsOptional()
    ong_category_id?: number | OngCategory;

    @IsString()
    @IsOptional()
    site_url?: string;

    @IsOptional()
    data?: JSON;
}
