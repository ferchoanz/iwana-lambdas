import pkg from 'pg';
const { Client } = pkg;
import { ErrorException } from './ErrorException.mjs';
import { andWhere, andWhereBetween } from './tools.mjs';

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

        const page = event.queryStringParameters?.page || 1;
        const perPage = event.queryStringParameters?.perPage || 30;
        const userId = event.queryStringParameters?.userId || null;
        const storeId = event.queryStringParameters?.storeId || null;
        const stateId = event.queryStringParameters?.stateId || null;
        const fromCreated = event.queryStringParameters?.fromCreated || null;
        const toCreated = event.queryStringParameters?.toCreated || null;
        const fromUpdated = event.queryStringParameters?.fromUpdated || null;
        const toUpdated = event.queryStringParameters?.toUpdated || null;
        const partnerId = event?.requestContext?.authorizer?.claims['custom:partner_id'] || null;
        let totalItems = null;
        let extraWhere = '';

        extraWhere += andWhereBetween('orders.created_at', fromCreated, toCreated);
        extraWhere += andWhereBetween('orders.updated_at', fromUpdated, toUpdated);
        extraWhere += andWhere('orders.user_id', userId);
        extraWhere += andWhere('orders.store_id', storeId);
        extraWhere += andWhere('orders.order_state_id', stateId);
        extraWhere = extraWhere.trim();

        if (partnerId === null) {
            throw new ErrorException(403, 'partner can\'t be undefined', context);
        }

        totalItems = await client.query(`SELECT COUNT(id) as total FROM orders WHERE orders.data->>'partner_id' = '${partnerId}' ${extraWhere}`);
        totalItems = totalItems.rowCount > 0 ? Number(totalItems.rows[0].total) : 0;

        const totalPage = Math.ceil(totalItems / perPage);

        const query = `
            SELECT
                orders.id as order_code,
                orders.earnings as cashback,
                orders.store_id,
                stores.name as store_name,
                orders.user_id,
                users.name as user_name,
                orders.order_state_id as state_id,
                orders.created_at,
                orders.updated_at
            FROM
                orders
            INNER JOIN
                stores on stores.id = orders.store_id
            INNER JOIN
                users on users.id = orders.user_id
            WHERE
                orders.data->>'partner_id' = '${partnerId}'
                ${extraWhere}
            ORDER BY
                orders.created_at DESC
            LIMIT
                ${perPage}
            OFFSET
                ${(page - 1) * perPage}
        `;

        let orders = await client.query(query);

        data = orders.rowCount > 0 ? orders.rows : [];

        return {
            statusCode: httpStatus,
            body: JSON.stringify({ httpStatus, data, totalItems, page, perPage, totalPage })
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
    "queryStringParameters": {
        "userId": "9",
        "perPage": "100",
        "page": "1",
        "fromCreated": "2020-01-31",
        "toCreated": "2022-12-31",
        "fromUpdated": "2021-02-20",
        "toUpdated": "2021-12-31",
        "storeId": 32,
        "stateId": 4
    },
    "requestContext": {
        "authorizer": {
            "claims": {
                "custom:partner_id": "1"
            }
        }
    }
}, {}, (e) => { console.log(e) })
    .then(res => console.log(res))
    .catch(e => console.log(e));