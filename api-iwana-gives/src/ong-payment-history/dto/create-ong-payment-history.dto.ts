import { OngPaymentState } from 'src/ong-payment-states/entities/ong-payment-state.entity';
import { OngPayment } from 'src/ong-payments/entities/ong-payment.entity';

export class CreateOngPaymentHistoryDto {
    ongPayment: OngPayment;

    ongPaymentState: OngPaymentState;
}
