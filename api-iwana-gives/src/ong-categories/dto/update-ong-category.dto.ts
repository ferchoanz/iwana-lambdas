import { PartialType } from '@nestjs/mapped-types';
import { CreateOngCategoryDto } from './create-ong-category.dto';

export class UpdateOngCategoryDto extends PartialType(CreateOngCategoryDto) {}
