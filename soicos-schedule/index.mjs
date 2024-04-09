import { ErrorException } from './ErrorException.mjs';
import pkg from 'pg';
const { Client } = pkg;
import axios from 'axios';
import moment from 'moment-timezone';

export const handler = async (event, context) => {

    const client = new Client({
        user: process.env.PGUSER || 'iwana_cashback',
        host: process.env.PGHOST || 'iwanaaffiliates.csapwwufkkn0.us-east-1.rds.amazonaws.com',
        database: process.env.PGDATABASE || 'iwanaaffiliates',
        password: process.env.PGPASSWORD || 'IwAnA128379823$%cashBaCk$)#',
        port: 5432
    });

    const mainClient = new Client({
        user: process.env.MAINPGUSER || 'iwana_cashback',
        host: process.env.MAINPGHOST || 'iwana.csapwwufkkn0.us-east-1.rds.amazonaws.com',
        database: process.env.MAINPGDATABASE || 'iwana',
        password: process.env.MAINPGPASSWORD || 'IwAnA128379823$%cashBaCk$)#',
        port: 5432
    });

    try {
        await client.connect((err) => {
            if (err) {
                throw new ErrorException(500, 'Internal Server Error', err);
            }
        });

        await mainClient.connect((err) => {
            if (err) {
                throw new ErrorException(500, 'Internal Server Error', err);
            }
        });

        const today = moment({ tz: 'America/Santiago' }).subtract(1, 'day').format('YYYY-MM-DD');

        let request = null;
        let url = `https://api.soicos.com/api/transactions/${today}/${today}?token=6b0ebc57e98077b2e7651819bfb33763&aid=37345`;

        // url='https://api.soicos.com/api/transactions/2023-02-21/2023-02-28?token=6b0ebc57e98077b2e7651819bfb33763&aid=37345'
        const exceptPromises = [];

        console.time('soicos-schedule');

        do {
            request = await axios.get(url)
                .then(response => response.data)
                .catch(() => null);
            const data = request?.data || [];
            let values = '';
            const ids = data.flatMap(item => item.status === 'PENDING' ? [item.transaction.orderID] : []);
            // const ids = data.filter(item => item.status === 'PENDING').map(item => item.id);
            const exceptQuery = `select * from (values ('${ids.join("'),('")}')) as t (order_code) except select order_code from orders where order_code in ('${ids.join("','")}') group by order_code`;

            const exceptReponse = await mainClient.query(exceptQuery).catch(e => { console.log(e); return null; });

            if (exceptReponse && exceptReponse?.rowCount > 1) {
                for (const id of exceptReponse.rows.map(item => item.order_code)) {
                    const order = data.find(item => item.transaction.orderID == id);
                    const [userId, storeId, linkTackId] = order?.click?.trackerID?.split(';');
                    const postbackUrl = 'https://iwanacash.com/' + (order.country === 'MX' ? 'postback-url-soicos-mx' : 'postback-url-soicos');
                    const promise = axios.get(`${postbackUrl}?USER_ID=${userId}&STORE_ID=${storeId}&TRANSACTION_ID=${id}&TOTAL=${order.transaction.total}&COMMISSION=${order.commission}&IMPNAME=${order.program}&IMPID=${order.programID}&TIME=${order.date_created}&TRACK_ID=${linkTackId}&CONV_ID=${order.id}&CRON_JOB=true`).catch(e => console.log(e));
                    exceptPromises.push(promise);
                }
            }

            for (const row of data) {
                if (row.click) {
                    const [userId, storeId, linkTackId] = row?.click?.trackerID?.split(';');
                    row.click = {
                        userId,
                        storeId,
                        linkTackId,
                        ...row.click
                    };
                }
                const transaction = row.transaction ? JSON.stringify(row.transaction) : null;
                const click = row.click ? JSON.stringify(row.click) : null;

                values = values + `(${row.id}, ${row.programID}, '${row.program}', '${row.date_created}', '${row.status}', '${row.commission}', '${row.ip}', '${row.country}', '${row.date_validated}', '${transaction}', '${click}'),`;
            }

            if (values != '') {
                await client.query(`
                    INSERT INTO
                        soicos (
                            id,
                            "programID",
                            program,
                            date_created,
                            status,
                            commission,
                            ip,
                            country,
                            date_validated,
                            transaction,
                            click
                        )
                        values ${values.slice(0, values.length - 1)}
                    ON CONFLICT ON CONSTRAINT socios_pkey DO UPDATE 
                    SET status = excluded.status;
                `).catch((e) => console.log(e));
            }

            url = request?.links?.next;
        } while (url);

        console.log(`total not registered orders are ${exceptPromises.length}.`);

        console.log(`Completed process of fetching soicos data from ${today}.`);

        console.timeEnd('soicos-schedule');

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

handler({}, {}).then(res => console.log(res));
