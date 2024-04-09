import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ParseIntPipe } from '@nestjs/common';
import { OngPaymentUserConfigsService } from './ong-payment-user-configs.service';
import { CreateOngPaymentUserConfigDto } from './dto/create-ong-payment-user-config.dto';
import { UpdateOngPaymentUserConfigDto } from './dto/update-ong-payment-user-config.dto';
import { GenericInterceptor } from 'src/shared/helpers/generic-interceptor';

@Controller('ong-payment-user-configs')
export class OngPaymentUserConfigsController {
    constructor(private readonly ongPaymentUserConfigsService: OngPaymentUserConfigsService) {}

    @Get(':userId/total-donate')
    @UseInterceptors(GenericInterceptor)
    getTotalDonateByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.ongPaymentUserConfigsService.totalDotateByUser(userId);
    }
}
