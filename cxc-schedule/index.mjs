import { ErrorException } from './ErrorException.mjs';
import pkg from 'pg';
const { Client } = pkg;
import { loadMoreInfo, jsonReplacer } from './Tools.mjs';

/**
 * @type { import('aws-lambda').Handler }
 * @param { import('aws-lambda').APIGatewayEvent } event
 * @param { import('aws-lambda').Context } context
 */
export const handler = async (event, context) => {

    const client = new Client({
        user: process.env.PGUSER || 'iwana_cashback',
        host: process.env.PGHOST || 'iwanacashback.csapwwufkkn0.us-east-1.rds.amazonaws.com',
        database: process.env.PGDATABASE || 'iwana',
        password: process.env.PGPASSWORD || 'IwAnA128379823$%cashBaCk$)#',
        port: 5432
    });

    try {
        await client.connect((err) => {
            if (err) {
                throw new ErrorException(500, 'Internal Server Error', err);
            }
        });

        console.time('CXC schedule');

        const { rows } = await client.query(`
            SELECT
                store_id,
                affiliate_status,
                array_to_json(array_agg(orders.*)) as orders
            FROM
                orders
            WHERE
                affiliate_status IN (1,4)
                AND order_state_id = 3
                AND earnings <= (CASE WHEN pais_id = 1 THEN 40000 WHEN pais_id = 2 THEN 800 END)
                AND store_id = 783
            GROUP BY
                store_id,
                affiliate_status
        `).catch(() => ({ rows: [] }));

        for (const row of rows) {
            const orders = [];

            let store = await client.query(`SELECT * from stores WHERE id = ${row.store_id} LIMIT 1`).catch(() => null);
            store = store?.rowCount ? store.rows[0] : null;
            let order_states = await client.query(`SELECT * FROM order_states`).catch(() => null);
            order_states = order_states?.rowCount ? order_states.rows : [];

            for (let order of row.orders) {
                order = await loadMoreInfo(order, client, { store, order_states });
                orders.push(order);
            }

            const buyOrder = await client.query(`
                INSERT INTO buy_orders
                    (
                        store_id,
                        buy_order_state_id,
                        orders_id,
                        nro_fact,
                        created_at,
                        updated_at
                    )
                VALUES
                    (
                        ${row.store_id},
                        ${row.affiliate_status == 1 ? 6 : 8},
                        '${JSON.stringify(orders, jsonReplacer)}',
                        'automatico',
                        CURRENT_TIMESTAMP,
                        CURRENT_TIMESTAMP
                    )
                RETURNING id
            `).catch(e => console.log(e));

            if (buyOrder?.rowCount) {
                await client.query(`
                    UPDATE
                        orders
                    SET
                        affiliate_status = (CASE WHEN affiliate_status = 1 THEN 6 WHEN affiliate_status = 4 THEN 8 END),
                        order_state_id = 4,
                        updated_at = CURRENT_TIMESTAMP
                    where
                        id IN ('${orders.map(order => order.id).join("','")}');
                `).catch(e => console.log(e));

                await client.query(`
                    INSERT INTO buy_orders_trazability
                        (
                            buy_order_id,
                            buy_order_state_id,
                            event_detail,
                            created_at,
                            updated_at
                        )
                    VALUES
                        (
                            ${buyOrder?.rows?.[0]?.id},
                            1,
                            'Se Creo la CXC automaticamente',
                            CURRENT_TIMESTAMP,
                            CURRENT_TIMESTAMP
                        ),
                        (
                            ${buyOrder?.rows?.[0]?.id},
                            ${row.affiliate_status == 1 ? 6 : 8},
                            'se agregaron ${orders.length} ordenes a la CXC automaticamente',
                            CURRENT_TIMESTAMP,
                            CURRENT_TIMESTAMP
                        )
                `).catch(e => console.log(e));
            }
        }

        console.timeEnd('CXC schedule');

        return true;

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

handler({}, {}).then(e => console.log(e)).catch(e => console.log(e));


/**
 * restriccion de 40mil pesos chile y 800 pesos mex
 * status 1 dejarlo en 6 y 4 pasarlo a 8 en CXC
 */