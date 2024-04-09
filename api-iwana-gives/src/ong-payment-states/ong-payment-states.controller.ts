import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OngPaymentStatesService } from './ong-payment-states.service';
import { CreateOngPaymentStateDto } from './dto/create-ong-payment-state.dto';
import { UpdateOngPaymentStateDto } from './dto/update-ong-payment-state.dto';

@Controller('ong-payment-states')
export class OngPaymentStatesController {
    constructor(private readonly ongPaymentStatesService: OngPaymentStatesService) {}
}
