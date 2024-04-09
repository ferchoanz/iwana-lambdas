import { Controller, Get, Param, UseInterceptors, ParseIntPipe, Request } from '@nestjs/common';
import { GenericInterceptor } from 'src/shared/helpers/generic-interceptor';
import { ListInterceptor } from 'src/shared/helpers/list-interceptor';
import { ListUserAmountDonateDto } from './../criterias/user-amount-donate.list';
import { UserAmountDonateAdminService } from '../services/user-amount-donate-admin.service';
import { ListUserAmountDonateHistoryDto } from 'src/user-amount-donate-history/criterias/user-amount-danate-history.list';

@Controller('admin/user-amount-donate')
export class UserAmountDonateAdminController {
    constructor(private readonly userAmountDonateAdminService: UserAmountDonateAdminService) {}

    @Get()
    @UseInterceptors(ListInterceptor)
    findAll(@Request() req: any) {
        const criteria = new ListUserAmountDonateDto(req.query, req.url);
        return this.userAmountDonateAdminService.findAll(criteria);
    }

    @Get(':id')
    @UseInterceptors(GenericInterceptor)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userAmountDonateAdminService.findOne(id);
    }

    @Get(':id/history')
    @UseInterceptors(ListInterceptor)
    list(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        const criteria = new ListUserAmountDonateHistoryDto(req.query, req.url);
        return this.userAmountDonateAdminService.findHistory(criteria, id);
    }
}
