import { PartialType } from '@nestjs/mapped-types';
import { CreateOngPaymentStateDto } from './create-ong-payment-state.dto';

export class UpdateOngPaymentStateDto extends PartialType(CreateOngPaymentStateDto) {}
