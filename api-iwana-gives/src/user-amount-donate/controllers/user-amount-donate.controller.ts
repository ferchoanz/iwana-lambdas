import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, ParseIntPipe, Put } from '@nestjs/common';
import { UserAmountDonateService } from '../services/user-amount-donate.service';
import { CreateUserAmountDonateDto } from '../dto/create-user-amount-donate.dto';
import { UpdateUserAmountDonateDto } from '../dto/update-user-amount-donate.dto';
import { GenericInterceptor } from 'src/shared/helpers/generic-interceptor';

@Controller('user-amount-donate')
export class UserAmountDonateController {
    constructor(private readonly userAmountDonateService: UserAmountDonateService) {}

    @Get(':userId/available-balance')
    @UseInterceptors(GenericInterceptor)
    availableBalance(@Param('userId', ParseIntPipe) userId: number) {
        return this.userAmountDonateService.availableBalance(userId);
    }

    @Get(':userId/by-user')
    @UseInterceptors(GenericInterceptor)
    findOneByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.userAmountDonateService.findOneByUser(userId);
    }

    @Post()
    @UseInterceptors(GenericInterceptor)
    save(@Body() data: CreateUserAmountDonateDto) {
        return this.userAmountDonateService.save(data);
    }

    @Put(':id')
    @UseInterceptors(GenericInterceptor)
    update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserAmountDonateDto) {
        return this.userAmountDonateService.update(id, data);
    }

    @Delete(':id')
    @UseInterceptors(GenericInterceptor)
    softDelete(@Param('id', ParseIntPipe) id: number) {
        return this.userAmountDonateService.softDelete(id);
    }
}
