import pkg from 'pg';
const { Client } = pkg;
import { ErrorException } from './ErrorException.mjs';

export const handler = async (event, context) => {

    const client = new Client({
        user: process.env.PGUSER || 'iwana_cashback',
        host: process.env.PGHOST || 'iwanacashback.csapwwufkkn0.us-east-1.rds.amazonaws.com',
        database: process.env.PGDATABASE || 'iwana',
        password: process.env.PGPASSWORD || 'IwAnA128379823$%cashBaCk$)#',
        port: 5432
    });

    const httpStatus = 200, message = 'Bank Account changed';

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
            email === null ||
            accountNumber === null ||
            userId === null ||
            bankId === null ||
            bankAccountTypeId === null ||
            countryId === null
        ) {
            throw new ErrorException(400, 'All fields are required',  context);
        }

        const acoount = await client.query(`
            UPDATE user_bank_accounts
            SET
                "name" = '${name}',
                dni = '${dni}',
                email = '${email}',
                account_number = '${accountNumber}',
                user_id = ${userId},
                bank_id = ${bankId},
                bank_account_type_id = ${bankAccountTypeId},
                pais_id = ${countryId},
                updated_at = CURRENT_TIMESTAMP
            WHERE
                id = '${accountId}' AND is_active = true
        `);

        if (acoount.rowCount === 0) {
            throw new ErrorException(400, 'Bank Account not changed', context);
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

handler({
    pathParameters: {
        accountId: "2041"
    },
    body:  "{\r\n    \"name\": \"Jose Prado\",\r\n    \"dni\": \"5555555\",\r\n    \"email\": \"josepadro@correo.com\",\r\n    \"accountNumber\": \"55555555\",\r\n    \"userId\": 944,\r\n    \"bankId\": 4,\r\n    \"bankAccountTypeId\": 1,\r\n    \"countryId\": 1\r\n}" 
  }, {}).then(res => console.log(res))
  .catch(e => console.log(e));
