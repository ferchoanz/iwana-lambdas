import { ErrorException } from './ErrorException.mjs';
import pkg from 'pg';
const { Client } = pkg;
import axios from 'axios';
import moment from 'moment-timezone';

export const handler = async (event, context) => {

    const client = new Client({
        user: process.env.PGUSER || 'iwana_cashback',
        host: process.env.PGHOST || 'iwana.csapwwufkkn0.us-east-1.rds.amazonaws.com',
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

        const today = moment({ tz: 'America/Santiago' }).subtract(1, 'day').format('YYYY-MM-DD');
        let url = `https://api.soicos.com/api/transactions/validated/${today}/${today}/0/validated?token=6b0ebc57e98077b2e7651819bfb33763&aid=37345`;
        // url = `https://api.soicos.com/api/transactions/validated/2023-04-26/2023-04-26/0/validated?token=6b0ebc57e98077b2e7651819bfb33763&aid=37345`;
        console.time(`soicos-schedule-validated ${today}`);
        do {
            const response = await axios.get(url).then(res => res.data).catch(() =>  null);
            const data = response?.data || [];
            const ids = data.flatMap(item => item.status === 'OK' ? [item.transaction.orderID, item.id] : []);
            const query = `UPDATE orders SET date_validated = '${today}', affiliate_status = 1 WHERE order_code IN ('${ids.join("','")}')`;
            if (ids.length > 0) {
                await client.query(query).catch(e => console.log({ error: e }));
            }
            console.log(`it was updated ${ids.length / 2} items.`);
            url = response?.links?.next;
        } while (url);
        console.timeEnd(`soicos-schedule-validated ${today}`);
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

handler({}, {}).then(res => console.log(res)).catch(e => console.log(e));
