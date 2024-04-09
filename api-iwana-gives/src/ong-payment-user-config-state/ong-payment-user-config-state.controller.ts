import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OngPaymentUserConfigStateService } from './ong-payment-user-config-state.service';
import { CreateOngPaymentUserConfigStateDto } from './dto/create-ong-payment-user-config-state.dto';
import { UpdateOngPaymentUserConfigStateDto } from './dto/update-ong-payment-user-config-state.dto';

@Controller('ong-payment-user-config-state')
export class OngPaymentUserConfigStateController {
    constructor(private readonly ongPaymentUserConfigStateService: OngPaymentUserConfigStateService) {}
}
