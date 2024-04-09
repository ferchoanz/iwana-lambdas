import { Controller, Get, Post, Body, Param, UseInterceptors, ParseIntPipe, Request } from '@nestjs/common';
import { OngUserConfigHistoriesService } from './ong-user-config-histories.service';
import { CreateOngUserConfigHistoryDto } from './dto/create-ong-user-config-history.dto';
import { GenericInterceptor } from 'src/shared/helpers/generic-interceptor';
import { ListInterceptor } from 'src/shared/helpers/list-interceptor';
import { ListOngUserConfigHistoryDto } from './criterias/ong-user-config-history.list';

@Controller('ong-user-config-histories')
export class OngUserConfigHistoriesController {
    constructor(private readonly ongUserConfigHistoriesService: OngUserConfigHistoriesService) {}

    @Get()
    @UseInterceptors(ListInterceptor)
    findAll(@Request() req: any) {
        const criteria = new ListOngUserConfigHistoryDto(req.query, req.url);
        return this.ongUserConfigHistoriesService.findAll(criteria);
    }

    @Get(':id')
    @UseInterceptors(GenericInterceptor)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ongUserConfigHistoriesService.findOne(id);
    }

    @Post()
    @UseInterceptors(GenericInterceptor)
    save(@Body() data: CreateOngUserConfigHistoryDto) {
        return this.ongUserConfigHistoriesService.save(data);
    }
}
