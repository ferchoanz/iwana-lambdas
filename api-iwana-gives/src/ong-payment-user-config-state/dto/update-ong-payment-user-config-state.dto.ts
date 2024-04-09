import { PartialType } from '@nestjs/mapped-types';
import { CreateOngPaymentUserConfigStateDto } from './create-ong-payment-user-config-state.dto';

export class UpdateOngPaymentUserConfigStateDto extends PartialType(CreateOngPaymentUserConfigStateDto) {}
