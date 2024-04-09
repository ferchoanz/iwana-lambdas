import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseInterceptors,
    ParseIntPipe,
    Put,
    Request,
} from '@nestjs/common';
import { OngUserConfigsService } from './ong-user-configs.service';
import { CreateOngUserConfigDto } from './dto/create-ong-user-config.dto';
import { UpdateOngUserConfigDto } from './dto/update-ong-user-config.dto';
import { GenericInterceptor } from 'src/shared/helpers/generic-interceptor';
import { ListInterceptor } from 'src/shared/helpers/list-interceptor';
import { ListOngUserConfigDto } from './criterias/ong-user-configs.list';

@Controller('ong-user-configs')
export class OngUserConfigsController {
    constructor(private readonly ongUserConfigsService: OngUserConfigsService) {}

    @Get()
    @UseInterceptors(ListInterceptor)
    findAll(@Request() req: any) {
        const criteria = new ListOngUserConfigDto(req.query, req.url);
        return this.ongUserConfigsService.findAll(criteria);
    }

    @Get(':id')
    @UseInterceptors(GenericInterceptor)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ongUserConfigsService.findOne(id);
    }

    @Post()
    @UseInterceptors(GenericInterceptor)
    save(@Body() data: CreateOngUserConfigDto) {
        return this.ongUserConfigsService.save(data);
    }

    @Put(':id')
    @UseInterceptors(GenericInterceptor)
    update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateOngUserConfigDto) {
        return this.ongUserConfigsService.update(id, data);
    }

    @Delete(':id')
    @UseInterceptors(GenericInterceptor)
    softDelete(@Param('id', ParseIntPipe) id: number) {
        return this.ongUserConfigsService.softDelete(id);
    }
}
