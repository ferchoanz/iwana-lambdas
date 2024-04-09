import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OngPaymentHistoryService } from './ong-payment-history.service';
import { CreateOngPaymentHistoryDto } from './dto/create-ong-payment-history.dto';

@Controller('ong-payment-history')
export class OngPaymentHistoryController {
    constructor(private readonly ongPaymentHistoryService: OngPaymentHistoryService) {}
}
