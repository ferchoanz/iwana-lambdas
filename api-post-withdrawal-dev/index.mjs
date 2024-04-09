import pkg from 'pg';
const { Client } = pkg;
import { ErrorException } from './ErrorException.mjs';

/**
 * @type { import('aws-lambda').Handler }
 * @param { import('aws-lambda').APIGatewayEvent } event
 * @param { import('aws-lambda').Context } context
 * @return { import('aws-lambda').APIGatewayProxyResult }
 */
export const handler = async (event, context) => {

    const client = new Client({
        user: process.env.PGUSER || 'iwana_cashback',
        host: process.env.PGHOST || 'iwanacashback.csapwwufkkn0.us-east-1.rds.amazonaws.com',
        database: process.env.PGDATABASE || 'iwana',
        password: process.env.PGPASSWORD || 'IwAnA128379823$%cashBaCk$)#',
        port: 5432
    });

    const httpStatus = 201, message = 'Withdrawal created';
    let data = {};

    try {
        await client.connect((err) => {
            if (err) {
                throw new ErrorException(500, 'Internal Server Error', err);
            }
        });

        const fields = JSON.parse(event?.body || null);

        const idBankAccount = fields?.idBankAccount || null;
        const userId = fields?.userId || null;
        const amount = fields?.amount || null;
        const countryId = fields?.countryId || 1;
        const partnerId = event?.requestContext?.authorizer?.claims['custom:partner_id'] || null;

        if (partnerId === null) {
            throw new ErrorException(403, 'partner can\'t be undefined', context);
        }

        if (
            idBankAccount === null,
            userId === null,
            amount === null
        ) {
            throw new ErrorException(400, 'All fields are required', context);
        }

        if (amount < 10000) {
            throw new ErrorException(400, 'Amount not valid', context);
        }

        const resultValidateBalance = await client.query(`
            SELECT
                SUM(CASE WHEN o.order_state_id = 4 THEN FLOOR(o.available) ELSE 0 END) as available
            FROM
                orders o
            WHERE
                user_id = ${userId} AND order_state_id = 4
        `);
        const response = resultValidateBalance.rows[0];

        if (response === undefined) {
            throw new ErrorException(400, 'User not found!', context);
        }

        const resultWithdrawal = await client.query(`
            SELECT SUM(amount) as amount
            FROM withdrawals
            WHERE user_id = ${userId} and is_payed = false
        `);

        const responseWithdrawal = resultWithdrawal.rows[0];

        if (responseWithdrawal && responseWithdrawal.amount) {
            response.available = response.available - responseWithdrawal.amount;
        }

        const balance = response.available;

        if (balance < amount) {
            throw new ErrorException(400, 'Insufficient balance', context);
        }

        let withdrawal = await client.query(`
            INSERT INTO withdrawals
                (
                    user_bank_account_id,
                    user_id,
                    amount,
                    pais_id,
                    partner_id,
                    created_at,
                    updated_at,
                    estimated_date,
                    is_payed,
                    is_notified
                )
                VALUES
                (
                    ${idBankAccount},
                    ${userId},
                    ${amount},
                    ${countryId},
                    ${partnerId},
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP + interval '5 days',
                    false,
                    false
                )
            RETURNING 
                user_bank_account_id as "idBankAccount",
                user_id as "userId",
                amount,
                pais_id as "countryId",
                created_at as "createdAt",
                updated_at as "updatedAt",
                estimated_date as "estimatedDate",
                is_payed as "isPayed",
                is_notified as "isNotified"
        `);

        if (withdrawal.rowCount === 0) {
            throw new ErrorException(400, 'Withdrawal not created', context);
        }

        withdrawal = withdrawal.rows[0];
        data = withdrawal;
        client.end();

        return {
            statusCode: httpStatus,
            body: JSON.stringify({ httpStatus, message, data })
        };

    } catch (error) {
        const stringError = error instanceof ErrorException ?
            JSON.stringify(error) :
            JSON.stringify({ httpStatus: 500, message: error.toString() });

        return {
            statusCode: error.httpStatus || 500,
            body: stringError
        };
    }
};

handler({
    "body": "{\r\n    \"idBankAccount\": 2046,\r\n    \"userId\": 116988,\r\n    \"amount\": 10000,\r\n    \"countryId\": 1\r\n}",
    "requestContext": {
        "authorizer": {
            "claims": {
                "custom:partner_id": "4"
            }
        }
    }
}, {})
    .then(res => console.log(res))
    .catch(e => console.log(e));
