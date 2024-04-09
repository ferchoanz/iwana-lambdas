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

        const today = moment({ utc: true }).subtract(1, 'day');
        // const startDate = '2023-09-27T00%3A00%3A00';
        const startDate = today.set({ hour: 0, minute: 0, seconds: 0 }).format('YYYY-MM-DDTHH:mm:ss').replace(/:/g, '%3A');
        // const endDate = '2023-09-27T23%3A59%3A59';
        const endDate = today.set({ hour: 23, minutes: 59, seconds: 59 }).format('YYYY-MM-DDTHH:mm:ss').replace(/:/g, '%3A');

        console.time(`awin-schedule-validated ${startDate}`);
        const url = `https://api.awin.com/publishers/661241/transactions/?startDate=${startDate}&endDate=${endDate}&timezone=UTC&dateType=validation`;
        const data = await axios.get(url, {
            headers: {
                Authorization: `Bearer 9534fa39-f5f5-4093-bde1-4ce1310fba1f`
            }
        }).then(res => res.data)
            .catch((e) => []);

        const paidIds = data.flatMap(item => item?.paidToPublisher ? [item.id] : []);
        const paidQuery = `UPDATE orders SET date_validated = '${today.toISOString()}', affiliate_status = 4 WHERE order_code IN ('${paidIds.join("','")}')`;
        if (paidIds.length > 0) {
            await client.query(paidQuery).catch(e => console.log({ error: e }));
        }
        console.log(`it was updated ${paidIds.length} paid items.`);

        const notPaidIds = data.flatMap(item => !item?.paidToPublisher ? [item.id] : []);
        const notPaidQuery = `UPDATE orders SET date_validated = '${today.toISOString()}', affiliate_status = 1 WHERE order_code IN ('${notPaidIds.join("','")}')`;
        if (notPaidIds.length > 0) {
            await client.query(notPaidQuery).catch(e => console.log({ error: e }));
        }
        console.log(`it was updated ${notPaidIds.length} not paid items.`);

        console.timeEnd(`awin-schedule-validated ${startDate}`);

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

handler({}, {})
    .then(r => console.log(r))
    .catch(e => console.log(e));