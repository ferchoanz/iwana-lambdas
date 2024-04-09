import { ErrorException } from './ErrorException.mjs';
import pkg from 'pg';
const { Client } = pkg;
import axios from 'axios';

const httpClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 7xc6r3rv7vb425yaqp3av86wqz'
    }
});

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

        const today = new Date();
        // today.setHours(today.getHours() - 1);
        const todayDate = today.toISOString().split('T')[0];
        // const hours = today.getHours();
        const baseUrl = 'https://iwanacash.com/api/v1/cj/orders';
        const sincePostingDate = `${todayDate}T00:00:00Z`;
        // const sincePostingDate = "2023-10-15T00:00:00Z";
        const beforePostingDate = `${todayDate}T23:59:59Z`;
        // const beforePostingDate = "2023-10-15T23:59:59Z";
        const publisherId = '5785484';
        // publisherCommissions(forPublishers: ["5785484"], sincePostingDate: "2023-02-01T00:00:00Z", beforePostingDate: "2023-02-28T00:00:00Z")

        const queryString = `{
            publisherCommissions(forPublishers: ["${publisherId}"], sincePostingDate: "${sincePostingDate}", beforePostingDate: "${beforePostingDate}")
            {
                count
                payloadComplete
                records {
                    orderId
                    shopperId
                    saleAmountUsd
                    postingDate
                    pubCommissionAmountUsd
                }    
            }
        }`;

        const graphqlQuery = {
            operationName: "commissions",
            query: queryString,
            variables: {}
        };

        const response = await httpClient.post('https://commissions.api.cj.com/query', graphqlQuery);

        const records = response?.data?.data?.publisherCommissions?.records || [];

        const transaccions = records.flatMap(record => record.shopperId ? [{
            TRACK_ID: record.shopperId,
            TRANSACTION_ID: record.orderId,
            TRANSTOTAL: record.saleAmountUsd,
            COMMISSION: record.pubCommissionAmountUsd,
            TIMEACTION: record.postingDate
        }] : []);

        const codes = transaccions.map(item => item.TRANSACTION_ID);
        const exceptQuery = `select * from (values ('${codes.join("'),('")}')) as t (order_code) except select order_code from orders where order_code in ('${codes.join("','")}') group by order_code`;
        const exceptReponse = await client.query(exceptQuery).then(r => r.rows).catch(e => { console.log(e); return []; });

        for (const code of exceptReponse) {
            const transaccion = transaccions.find(item => item.TRANSACTION_ID === code);
            let params = '?';
            for (const key in transaccion) {
                params += `${key}=${transaccion[key]}&`;
            }
            params = params.slice(0, params.length - 1);

            httpClient.get(baseUrl + params, { headers: { "Authorization": "ac-Auwyeh88s211d5ywhpq8Sjd-token" } }).catch(e => console.log(e.response));
        }

        return { transaccions, sincePostingDate, beforePostingDate, exceptionCount: exceptReponse.length };

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
    .then(r => console.log(r));