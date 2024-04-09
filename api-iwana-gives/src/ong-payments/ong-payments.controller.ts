import { Controller, Get, Post, Body, Param, UseInterceptors, Request, Put } from '@nestjs/common';
import { OngPaymentsService } from './ong-payments.service';
import { CreateOngPaymentDto } from './dto/create-ong-payment.dto';
import { PaymentGeneratorService } from './payment-generator.service';
import { ListInterceptor } from 'src/shared/helpers/list-interceptor';
import { ListOngPaymentDto } from './criterias/ong-payment.list';
import { GenericInterceptor } from 'src/shared/helpers/generic-interceptor';
import { UpdateOngPaymentDto } from './dto/update-ong-payment.dto';

@Controller('admin/ong-payments')
export class OngPaymentsController {
    constructor(
        private readonly ongPaymentsService: OngPaymentsService,
        private readonly paymentGeneratorService: PaymentGeneratorService,
    ) {}

    @Post()
    @UseInterceptors(GenericInterceptor)
    save(@Body() data: CreateOngPaymentDto) {
        return this.ongPaymentsService.save(data);
    }

    @Get()
    @UseInterceptors(ListInterceptor)
    findAll(@Request() req: any) {
        const criteria = new ListOngPaymentDto(req.query, req.url);
        return this.ongPaymentsService.findAll(criteria);
    }

    @Post('generate')
    @UseInterceptors(GenericInterceptor)
    generatePayment() {
        return this.paymentGeneratorService.paymentGenerator();
    }

    @Get(':id')
    @UseInterceptors(GenericInterceptor)
    findOne(@Param('id') id: number) {
        return this.ongPaymentsService.findOne(id);
    }

    @Put(':id')
    @UseInterceptors(GenericInterceptor)
    update(@Param('id') id: number, @Body() data: UpdateOngPaymentDto) {
        return this.ongPaymentsService.update(id, data);
    }
}
