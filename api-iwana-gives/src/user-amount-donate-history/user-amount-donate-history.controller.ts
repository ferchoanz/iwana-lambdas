import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ParseIntPipe } from '@nestjs/common';
import { UserAmountDonateHistoryService } from './user-amount-donate-history.service';
import { CreateUserAmountDonateHistoryDto } from './dto/create-user-amount-donate-history.dto';
import { GenericInterceptor } from 'src/shared/helpers/generic-interceptor';

@Controller('user-amount-donate-history')
export class UserAmountDonateHistoryController {
    constructor(private readonly userAmountDonateHistoryService: UserAmountDonateHistoryService) {}

    @Get(':id')
    @UseInterceptors(GenericInterceptor)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userAmountDonateHistoryService.findOne(id);
    }
}
