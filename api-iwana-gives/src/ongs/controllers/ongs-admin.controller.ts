import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Request,
    UseInterceptors,
} from '@nestjs/common';
import { GenericInterceptor } from 'src/shared/helpers/generic-interceptor';
import { ListInterceptor } from 'src/shared/helpers/list-interceptor';
import { ListOngDto } from '../criterias/ong.list';
import { CreateOngDto } from '../dto/create-ong.dto';
import { UpdateOngDto } from '../dto/update-ong.dto';
import { OngsAdminService } from '../services/ongs-admin.service';

@Controller('admin/ongs')
export class OngsAdminController {
    constructor(private readonly ongsAdminService: OngsAdminService) {}

    @Post()
    @UseInterceptors(GenericInterceptor)
    save(@Body() data: CreateOngDto) {
        return this.ongsAdminService.save(data);
    }

    @Get()
    @UseInterceptors(ListInterceptor)
    getAll(@Request() req: any) {
        const criteria = new ListOngDto(req.query, req.url);
        return this.ongsAdminService.findAll(criteria);
    }

    @Get('/donates')
    @UseInterceptors(ListInterceptor)
    getAllWithDonates(@Request() req: any) {
        const criteria = new ListOngDto(req.query, req.url);
        return this.ongsAdminService.findOngWithDonates(criteria);
    }

    @Get(':id')
    @UseInterceptors(GenericInterceptor)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ongsAdminService.findOne(id);
    }

    @Put(':id')
    @UseInterceptors(GenericInterceptor)
    update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateOngDto) {
        return this.ongsAdminService.update(id, data);
    }

    @Delete(':id')
    @UseInterceptors(GenericInterceptor)
    softDelete(@Param('id', ParseIntPipe) id: number) {
        return this.ongsAdminService.softDelete(id);
    }
}
