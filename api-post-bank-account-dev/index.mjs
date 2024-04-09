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

    const httpStatus = 201, message = 'Bank account created';
    let data = {};

    try {
        await client.connect((err) => {
            if (err) {
                throw new ErrorException(500, 'Internal Server Error', err);
            }
        });

        const fields = JSON.parse(event?.body || null);

        const name = fields?.name || null;
        const dni = fields?.dni || null;
        const email = fields?.email || null;
        const accountNumber = fields?.accountNumber || null;
        const userId = fields?.userId || null;
        const bankId = fields?.bankId || null;
        const bankAccountTypeId = fields?.bankAccountTypeId || null ;
        const countryId = fields?.countryId || null;

        if (
            name === null ||
            dni === null ||
            accountNumber === null ||
            userId === null ||
            bankId === null ||
            bankAccountTypeId === null ||
            countryId === null
        ) {
            throw new ErrorException(400, 'All fields are required',  context);
        }

        let account = await client.query(`
            INSERT INTO user_bank_accounts
                (
                    "name",
                    dni,
                    email,
                    account_number,
                    user_id,
                    bank_id,
                    bank_account_type_id,
                    pais_id,
                    created_at,
                    updated_at
                )
                VALUES (
                    '${name}',
                    '${dni}',
                    '${email}',
                    '${accountNumber}',
                    ${userId},
                    ${bankId},
                    ${bankAccountTypeId},
                    ${countryId},
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP
                )
            RETURNING
                id,
                name,
                dni,
                email,
                account_number as "accountNumber",
                user_id as "userId",
                bank_id as "bankId",
                bank_account_type_id as "bankAccountTypeId",
                pais_id as "countryId",
                created_at as "createdAt",
                updated_at as "updatedAt"
        `);

        if (account.rowCount === 0) {
            throw new ErrorException(400, 'User Bank not created', context);
        }

        account = account.rows[0];

        data = {
            ...account,
            id: Number(account.id)
        };
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
  body:  "{\r\n    \"name\": \"Fernando Pacheco\",\r\n    \"dni\": \"5555555\",\r\n    \"email\": \"fercho0281@gmail.com\",\r\n    \"accountNumber\": \"55555555\",\r\n    \"userId\": 116986,\r\n    \"bankId\": 4,\r\n    \"bankAccountTypeId\": 1,\r\n    \"countryId\": 1\r\n}" 
}, {}).then(res => console.log(res))
.catch(e => console.log(e));