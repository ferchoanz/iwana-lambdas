import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseInterceptors,
    Request,
    ParseIntPipe,
    Put,
    Delete,
} from '@nestjs/common';
import { CreateOngCategoryDto } from '../dto/create-ong-category.dto';
import { ListInterceptor } from 'src/shared/helpers/list-interceptor';
import { ListOngCategoryDto } from '../criterias/ong-category.list';
import { GenericInterceptor } from 'src/shared/helpers/generic-interceptor';
import { OngCategoriesAdminService } from '../services/ong-categories-admin.service';
import { UpdateOngCategoryDto } from '../dto/update-ong-category.dto';

@Controller('admin/ong-categories')
export class OngCategoriesAdminController {
    constructor(private readonly ongCategoriesAdminService: OngCategoriesAdminService) {}

    @Get()
    @UseInterceptors(ListInterceptor)
    findAll(@Request() req: any) {
        const criteria = new ListOngCategoryDto(req.query, req.url);
        return this.ongCategoriesAdminService.findAll(criteria);
    }

    @Get(':id')
    @UseInterceptors(GenericInterceptor)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ongCategoriesAdminService.findOne(id);
    }

    @Post()
    @UseInterceptors(GenericInterceptor)
    save(@Body() data: CreateOngCategoryDto) {
        return this.ongCategoriesAdminService.save(data);
    }

    @Put(':id')
    @UseInterceptors(GenericInterceptor)
    update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateOngCategoryDto) {
        return this.ongCategoriesAdminService.update(id, data);
    }

    @Delete(':id')
    @UseInterceptors(GenericInterceptor)
    softDelete(@Param('id', ParseIntPipe) id: number) {
        return this.ongCategoriesAdminService.softDelete(id);
    }
}
