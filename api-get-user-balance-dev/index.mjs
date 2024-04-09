import pkg from 'pg';
const { Client } = pkg;
import { ErrorException } from './ErrorException.mjs';

/**
 * @type {import('aws-lambda').Handler}
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @param {import('aws-lambda').Context} context
 * @return {import('aws-lambda').APIGatewayProxyResult}
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

        const userId = event.pathParameters.userId;
        const partnerId = event?.requestContext?.authorizer?.claims['custom:partner_id'] || null;

        if (partnerId === null) {
            throw new ErrorException(403, 'partner can\'t be undefined', context);
        }

        const res = await client.query(`
            SELECT
                u.id as user_id,
                SUM(CASE WHEN o.order_state_id IN (2, 9) THEN 0 ELSE FLOOR(o.earnings) END) as earned,
                SUM(CASE WHEN o.order_state_id = 4 THEN FLOOR(o.available) ELSE 0 END) as available,
                SUM(CASE WHEN o.order_state_id IN (1, 3) THEN FLOOR(o.earnings) ELSE 0 END) as pending,
                (
                    SELECT
                        SUM(FLOOR(w.amount))
                    FROM users u
                    LEFT JOIN withdrawals w ON u.id = w.user_id
                    WHERE
                        u.id = ${userId}
                        AND w.is_payed = true
                        AND w.partner_id = ${partnerId}
                ) AS withdrawn
            FROM users u
            LEFT JOIN orders o ON
                u.id = o.user_id
                AND (case when o.data->>'partner_id' is null then 3 else cast(o.data->>'partner_id' as bigint) end) = ${partnerId}
            WHERE
                u.id = ${userId}
            GROUP BY u.id
        `);

        if (res.rowCount === 0) {
            throw new ErrorException(404, 'User not found', context);
        }

        const resp = res.rows[0];

        const resultWithdrawal = await client.query(`SELECT sum(amount) as amount FROM withdrawals WHERE user_id = ${userId} AND is_payed = false AND partner_id = ${partnerId}`);
        const responseWithdrawal = resultWithdrawal.rows[0];

        if (responseWithdrawal && responseWithdrawal.amount) {
            resp.available = resp.available - responseWithdrawal.amount;
        }

        data = {
            cashbackEarned: Number(resp.earned),
            cashbackAvailable: Number(resp.available),
            cashbackPending: Number(resp.pending),
            cashbackWithdrawn: resp.withdrawn ? Number(resp.withdrawn) : 0
        };

        client.end();

        return {
            statusCode: httpStatus,
            body: JSON.stringify({ httpStatus, data }),
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
    "pathParameters": {
        "userId": 116986
    },
    "requestContext": {
        "authorizer": {
            "claims": {
                "custom:partner_id": "3"
            }
        }
    }
}, {})
    .then(res => console.log(res))
    .catch(e => console.log(e));