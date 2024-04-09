import { IsNumber } from 'class-validator';
import { OngPaymentUserConfigState } from 'src/ong-payment-user-config-state/entities/ong-payment-user-config-state.entity';
import { OngPayment } from 'src/ong-payments/entities/ong-payment.entity';
import { OngUserConfig } from 'src/ong-user-configs/entities/ong-user-config.entity';

export class CreateOngPaymentUserConfigDto {
    ongPayment: OngPayment;

    ongUserConfig: OngUserConfig;

    ongPaymentUserConfigState: OngPaymentUserConfigState;

    @IsNumber()
    percent: number;

    @IsNumber()
    amount: number;
}
