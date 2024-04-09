import { Controller, Get, Param, ParseIntPipe, Post, Put, Request, UseInterceptors } from '@nestjs/common';
import { GenericInterceptor } from 'src/shared/helpers/generic-interceptor';
import { ListInterceptor } from 'src/shared/helpers/list-interceptor';
import { ListOngDto } from '../criterias/ong.list';
import { OngsService } from '../services/ongs.service';

@Controller('ongs')
export class OngsController {
    constructor(private readonly ongsService: OngsService) {}

    @Get()
    @UseInterceptors(ListInterceptor)
    getAll(@Request() req: any) {
        const criteria = new ListOngDto(req.query, req.url);
        return this.ongsService.findAll(criteria);
    }

    @Get(':id')
    @UseInterceptors(GenericInterceptor)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ongsService.findOne(id);
    }
}
