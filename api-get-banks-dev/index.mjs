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

    const httpStatus = 200;
    let data = [], count;

    try {
        await client.connect((err) => {
            if (err) {
                throw new ErrorException(500, 'Internal Server Error', err);
            }
        });

        const countryId = event.queryStringParameters?.countryId || null;

        if (countryId === null) {
            throw new ErrorException(400, 'countryId is required', context);
        }

        let banks = await client.query(`SELECT id, name FROM banks WHERE country_id  = ${countryId} ORDER BY id asc`);
        banks = banks.rows;

        if (banks === null) {
            throw new ErrorException(400, 'Something has gone wrong', context);
        }

        data = banks.map(bank => ({
            bankId: bank.id,
            bankName: bank.name,
        }));
        count = banks.length;
        client.end();

        return {
            statusCode: httpStatus,
            body: JSON.stringify({ httpStatus, count, data })
        };

    } catch (error) {
        return {
            statusCode: error.httpStatus || 500,
            body: JSON.stringify(error)
        };
    }
};

handler({ queryStringParameters: { countryId: 1 } }, {})
    .then(res => console.log(res))
    .catch(e => console.log(e));