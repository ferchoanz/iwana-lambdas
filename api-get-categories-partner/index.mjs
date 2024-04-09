
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
    let data = {};

    try {

        await client.connect((err) => {
            if (err) {
                throw new ErrorException(500, 'Internal Server Error', err);
            }
        });

        const countryId = event?.queryStringParameters?.countryId || 1;

        const categories = await client.query(`
            SELECT
                c.id as "categoryId",
                c.name as "categoryName"
            FROM
                categories c
            INNER JOIN
                categoria_pais cp on cp.category_id = c.id
            WHERE
                c.is_active = true AND cp.pais_id = ${countryId}
            ORDER BY
                c.name asc
        `);

        data = categories.rowCount > 0 ? categories.rows : [];

        const count = data.length;

        client.end();

        return {
            statusCode: httpStatus,
            body: JSON.stringify({ httpStatus, count, data })
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
    queryStringParameters: {
        countryId: "2"
    }
}, {})
    .then(res => console.log(res))
    .catch((e) => console.log(e));