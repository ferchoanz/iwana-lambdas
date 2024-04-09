import { OngPaymentState } from 'src/ong-payment-states/entities/ong-payment-state.entity';
import { OngPaymentUserConfigState } from 'src/ong-payment-user-config-state/entities/ong-payment-user-config-state.entity';
import { OngPaymentUserConfig } from 'src/ong-payment-user-configs/entities/ong-payment-user-config.entity';
import { OngPayment } from 'src/ong-payments/entities/ong-payment.entity';
import { OngUserConfigHistory } from 'src/ong-user-config-histories/entities/ong-user-config-history.entity';
import { OngUserConfig } from 'src/ong-user-configs/entities/ong-user-config.entity';
import { Ong } from 'src/ongs/entities/ong.entity';
import { OngPaymentHistory } from 'src/ong-payment-history/entities/ong-payment-history.entity';
import { UserAmountDonate } from 'src/user-amount-donate/entities/user-amount-donate.entity';
import { User } from 'src/users/user.entity';
import { UserAmountDonateHistory } from 'src/user-amount-donate-history/entities/user-amount-donate-history.entity';
import { OngCategory } from 'src/ong-categories/entities/ong-category.entity';
import { Order } from 'src/orders/entities/order.entity';

export const config = () => ({
    port: parseInt(process.env.SERVER_PORT) || 8080,
    baseUrl: process.env.BASE_URL,
    database: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: `${process.env.DB_PASSWORD}`,
        database: process.env.DB_DATABASE,
        entities: [
            User,
            Ong,
            OngUserConfig,
            OngUserConfigHistory,
            UserAmountDonate,
            OngPaymentUserConfigState,
            OngPaymentUserConfig,
            OngPayment,
            OngPaymentState,
            OngPaymentHistory,
            UserAmountDonateHistory,
            OngCategory,
            Order,
        ],
        synchronize: `${process.env.DB_SYNC}` === 'true' ? true : false,
    },
    jwt: {
        keySecret: `${process.env.JWT_SECRET}`,
        expired: `${process.env.JWT_EXPIRES}`,
    },
    api: {
        iwanaCash: {
            baseUrl: process.env.IWANA_CASH_BASE_URL,
        },
        sendgrid: {
            baseUrl: process.env.SENDGRID_BASE_URL,
            token: process.env.SENDGRID_TOKEN,
        },
    },
});
