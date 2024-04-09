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

        const today = moment({ utc: true }).subtract(1, 'day');
        const startDate = '2023-10-02T00%3A00%3A00';
        // const startDate = today.set({ hour: 0, minute: 0 }).format('YYYY-MM-DDTHH:mm:ss').replace(/:/g, '%3A');
        const endDate = '2023-10-02T23%3A00%3A00';
        // const endDate = today.set({ hour: 23, minutes: 59 }).format('YYYY-MM-DDTHH:mm:ss').replace(/:/g, '%3A');

        const url = `https://api.awin.com/publishers/661241/transactions/?status=pending&startDate=${startDate}&endDate=${endDate}&timezone=UTC`;
        const data = await axios.get(url, {
            headers: {
                Authorization: `Bearer 9534fa39-f5f5-4093-bde1-4ce1310fba1f`
            }
        }).then(res => res.data)
            .catch((e) => []);

        const exceptPromises = [];
        let values = '';

        console.time('awin-schedule');

        const ids = data.map(item => item.id);
        const exceptQuery = `select * from (values ('${ids.join("'),('")}')) as t (order_code) except select order_code from orders where order_code in ('${ids.join("','")}') group by order_code`;
        const exceptReponse = await mainClient.query(exceptQuery).catch(e => { console.log(e); return null; });

        if (exceptReponse && exceptReponse?.rowCount > 1) {
            for (const id of exceptReponse.rows.map(item => item.order_code)) {
                const order = data.find(item => item.id == id);
                const postbackUrl = 'https://iwanacash.com/postback-url-awin';
                const promise = axios.get(`${postbackUrl}?clickref=${order?.clickRefs?.clickRef}&clickref2=${order?.clickRefs?.clickRef2}&clickref3=${order?.clickRefs?.clickRef3}&transactionId=${id}&transactionAmount=${order?.saleAmount?.amount}&commission=${order?.commissionAmount?.amount}&merchantId=${order?.advertiserId}&clickTime=${order?.advertiserId}&CRON_JOB=true`).catch(e => console.log(e));
                exceptPromises.push(promise);
            }
        }

        for (const row of data) {
            values += '(';
            for (const key in row) {
                values += (typeof row[key] === "object" ? `'${JSON.stringify(row[key])}'` : `'${row[key]}'`) + ',';
            }
            values = values.slice(0, values.length - 1) + '),';
        }
        values = values.slice(0, values.length - 1);

        if (values != '') {
            await client.query(`
                INSERT INTO
                    awin (
                        "id",
                        "url",
                        "advertiserId",
                        "publisherId",
                        "commissionSharingPublisherId",
                        "commissionSharingSelectedRatePublisherId",
                        "campaign",
                        "siteName",
                        "commissionStatus",
                        "commissionAmount",
                        "saleAmount",
                        "ipHash",
                        "customerCountry",
                        "clickRefs",
                        "clickDate",
                        "transactionDate",
                        "validationDate",
                        "type",
                        "declineReason",
                        "voucherCodeUsed",
                        "voucherCode",
                        "lapseTime",
                        "amended",
                        "amendReason",
                        "oldSaleAmount",
                        "oldCommissionAmount",
                        "clickDevice",
                        "transactionDevice",
                        "customerAcquisition",
                        "publisherUrl",
                        "advertiserCountry",
                        "orderRef",
                        "customParameters",
                        "transactionParts",
                        "paidToPublisher",
                        "paymentId",
                        "transactionQueryId",
                        "trackedCurrencyAmount",
                        "originalSaleAmount",
                        "advertiserCost",
                        "basketProducts"
                    )
                    values ${values}
                ON CONFLICT ON CONSTRAINT awin_pkey DO NOTHING
            `).catch(e => console.log(e));
        }
        
        console.log(`total not registered orders are ${exceptPromises.length}.`);

        console.log(`Completed process of fetching awin data from ${today}.`);

        console.timeEnd('awin-schedule');

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
