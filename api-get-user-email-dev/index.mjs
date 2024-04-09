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

    const httpStatus = 200, iwanaExists = true;
    let data = {};

    try {
        await client.connect((err) => {
            if (err) {
                throw new ErrorException(500, 'Internal Server Error', err);
            }
        });

        let email = event.pathParameters?.email || null;

        if (email === null) {
            throw new ErrorException(400, 'email is required', context);
        }

        email = email.trim().replace(/ /g, "+");

        let user = await client.query(`SELECT id, email FROM users WHERE email = '${email}'`);

        if (user.rowCount === 0) {
            throw new ErrorException(404, 'User not found');
        }

        user = user.rows[0];
        data = {
            ...user,
            iwanaExists
        };

        client.end();

        return {
            statusCode: httpStatus,
            body: JSON.stringify({ httpStatus, data })
        };

    } catch (error) {
        return {
            statusCode: error.httpStatus || 500,
            body: JSON.stringify(error)
        };
    }
};

handler({
    "pathParameters": {
        "email": "meni.henigman@gmail.com"
    }
}, {})
    .then(res => console.log(res))
    .catch(e => console.log(e));
