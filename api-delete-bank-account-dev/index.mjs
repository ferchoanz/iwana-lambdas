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

    const httpStatus = 200, message = 'Bank Account deleted';

    try {
        await client.connect((err) => {
            if (err) {
                throw new ErrorException(500, 'Internal Server Error', err);
            }
        });

        const accountId = event.pathParameters?.accountId || null;

        if (accountId === null) {
            throw new ErrorException(400, 'accountId is required', context);
        }

        const result = await client. query(`
            UPDATE
                user_bank_accounts
            SET
                is_active = false,
                updated_at = CURRENT_TIMESTAMP
            WHERE
                id = '${accountId}'
                AND is_active = true
        `);

        if (result.rowCount === 0) {
            throw new ErrorException(400, 'Bank Account not found', context);
        }

        client.end();

        return {
            statusCode: httpStatus,
            body: JSON.stringify({ httpStatus, message })
        };

    } catch (error) {
        return {
            statusCode: error.httpStatus || 500,
            body: JSON.stringify(error)
        };
    }
};

handler({ "pathParameters": { "accountId": 31 } }, {})
    .then(res => console.log(res))
    .catch(e => console.log(e));