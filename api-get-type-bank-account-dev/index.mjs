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

        let types = await client.query(`SELECT id, "name" FROM bank_account_types ORDER BY id asc`);

        types = types.rows;

        if (types === null) {
            throw new ErrorException(500, 'Something has gone wrong', context);
        }

        data = types;
        count = types.length;
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

handler({}, {})
    .then(res => console.log(res))
    .catch(e => console.log(e));
