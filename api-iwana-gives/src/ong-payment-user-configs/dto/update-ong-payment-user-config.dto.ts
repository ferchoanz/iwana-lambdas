import { PartialType } from '@nestjs/mapped-types';
import { CreateOngPaymentUserConfigDto } from './create-ong-payment-user-config.dto';

export class UpdateOngPaymentUserConfigDto extends PartialType(CreateOngPaymentUserConfigDto) {}
