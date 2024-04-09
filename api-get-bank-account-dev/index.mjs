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

    const httpStatus = 200;
    let data = {};

    try {
        await client.connect((err) => {
            if (err) {
                throw new ErrorException(500, 'Internal Server Error', err);
            }
        });

        const userId = event?.queryStringParameters?.userId || null;

        if (userId === null) {
            throw new ErrorException(400, 'userId is required', context);
        }

        let account = await client.query(`
            SELECT
                uba.id,
                uba.dni,
                uba.name,
                uba.account_number as "accountNumber",
                uba.pais_id as "countryId",
                b.name as "bankName",
                uba.email,
                b.id as "bankId",
                b.image as "bankImage",
                bat.id as "bankAccountTypeId",
                bat.name as "bankAccountType",
                uba.created_at as "createdAt",
                uba.updated_at as "updatedAt"
            FROM user_bank_accounts uba
            INNER JOIN banks b on uba.bank_id = b.id 
            INNER JOIN bank_account_types bat on uba.bank_account_type_id = bat.id 
            WHERE user_id = ${userId} AND is_active = true
            ORDER BY uba.created_at
            LIMIT 1
        `);

        if (account.rowCount === 0) {
            throw new ErrorException(404, 'User not found', context);
        }

        account = account.rows[0];
        const urlBase = 'https://d3dt97c0uw9g9q.cloudfront.net/images/banks/';

        data = {
            ...account,
            id: Number(account.id),
            bankImage: urlBase + account.bankImage,
        };

        client.end();

        return {
            statusCode: httpStatus,
            body: JSON.stringify({ httpStatus, data })
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

handler({ "queryStringParameters": { "userId": 944 } }, {})
    .then(res => console.log(res))
    .catch(e => console.log(e));