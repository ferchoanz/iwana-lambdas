import { Controller, Get, Param, UseInterceptors, Request, ParseIntPipe } from '@nestjs/common';
import { OngCategoriesService } from '../services/ong-categories.service';
import { ListInterceptor } from 'src/shared/helpers/list-interceptor';
import { ListOngCategoryDto } from '../criterias/ong-category.list';
import { GenericInterceptor } from 'src/shared/helpers/generic-interceptor';

@Controller('ong-categories')
export class OngCategoriesController {
    constructor(private readonly ongCategoriesService: OngCategoriesService) {}

    @Get()
    @UseInterceptors(ListInterceptor)
    findAll(@Request() req: any) {
        const criteria = new ListOngCategoryDto(req.query, req.url);
        return this.ongCategoriesService.findAll(criteria);
    }

    @Get(':id')
    @UseInterceptors(GenericInterceptor)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ongCategoriesService.findOne(id);
    }
}
