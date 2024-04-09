// role = api-get-store-dev-role-0vwzefgz
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

        const userId = event.queryStringParameters?.userId || null;
        const storeId = event.pathParameters?.storeId || null;
        const partnerId = event?.requestContext?.authorizer?.claims['custom:partner_id'] || null;
        const urlSplash = process.env.URLSPLASH || 'https://splash-dev.iwanacash.com';

        if (userId === null) {
            throw new ErrorException(400, 'userId is required', context);
        }

        if (storeId === null) {
            throw new ErrorException(400, 'storeId is required', context);
        }

        if (partnerId === null) {
            throw new ErrorException(403, 'partner can\'t be undefined', context);
        }

        let store = await client.query(`
            SELECT 
                id as store_id, image, name, url_store, terms, description, link, discount, header_image
            FROM stores
            WHERE
                id = ${storeId} AND is_active = true
            limit 1
        `);

        if (store.rowCount === 0) {
            throw new ErrorException(404, 'store not found', context);
        }

        store = store.rows[0];

        /** reutilizacion de codigo de api-get-stores-cashback-rankmi */
        const idStore = store.store_id.toString();
        const buff = new Buffer.from(idStore);
        const storeIdBase64 = buff.toString('base64');

        const buffUser = new Buffer.from(userId.toString());
        const userIdBase64 = buffUser.toString('base64');

        const buffPartner = new Buffer.from(partnerId.toString());
        const partnerIdBase64 = buffPartner.toString('base64');

        const columnsCashback = 'c.id as cs_id, c.name as cs_name, c.description, c.discount as  cs_discount';
        const tablesCashback = 'cashbacks c';
        const conditionsCashback = `(c.end_date >= now() or c.end_date IS NULL)
                AND c.init_date <= now()
                AND c.is_active = true
                and c.store_id = ${store.store_id}`;
        const orderCashback = 'c.id asc';

        const resultCashback = await client.query(`SELECT ${columnsCashback} FROM ${tablesCashback} WHERE ${conditionsCashback} ORDER BY ${orderCashback} `);
        const responseCashback = resultCashback.rows;

        const urlTracking = urlSplash + '?ru=' + userIdBase64 + '&rt=' + storeIdBase64 + '&rp=' + partnerIdBase64 + '&rr=web';

        let dataCashback = [];
        responseCashback.forEach(elementCashback => {
            const cashbackId = elementCashback.cs_id.toString();
            const buffCashbackId = new Buffer.from(cashbackId);
            const cashbackIdBase64 = buffCashbackId.toString('base64');
            const urlTrackingCashback = urlSplash + '?ru=' + userIdBase64 + '&rt=' + storeIdBase64 + '&rc=' + cashbackIdBase64 + '&rp=' + partnerIdBase64 + '&rr=web';
            const cashback = {
                cashbackId: elementCashback.cs_id,
                cashbackName: elementCashback.cs_name,
                cashbackDescription: elementCashback.description.replace(/(<([^>]+)>)/gi, ''),
                cashbackDiscount: elementCashback.cs_discount,
                cashbackTracking: urlTrackingCashback
            };

            dataCashback.push(cashback);

        });
        const urlBase = 'https://d3dt97c0uw9g9q.cloudfront.net/';

        const termsWithouthTags = store.terms.replace(/(<([^>]+)>)/gi, ''); // Quita las etiquetas HTML
        let termsWithouthNbsp = termsWithouthTags.replace(/&nbsp;/g, '');
        const descriptionWithouthTags = store.description.replace(/(<([^>]+)>)/gi, '');
        const descriptionWithouthNbsp = descriptionWithouthTags.replace(/&nbsp;/g, ' ');

        //Extraccion del tiempo de espera en terminos y condiciones
        const monthEnd = termsWithouthNbsp.indexOf('.'); //Indice final de "Tiempo de espera cashback"
        const waitedTime = termsWithouthNbsp.indexOf(':'); // Indice inicial de "tiempo espera cashback"
        const month = termsWithouthNbsp.slice(waitedTime + 1, monthEnd);

        //Extraccion de las categorias en terminos y condiciones
        const categoriesEnd = termsWithouthNbsp.indexOf('.', monthEnd + 1);
        const categoriesStart = termsWithouthNbsp.indexOf('Categorías:');
        const categories = termsWithouthNbsp.slice(categoriesStart + 11, categoriesEnd + 1);

        //Extraccion de las exclusiones en terminos y condiciones
        const exlusionEnd = termsWithouthNbsp.indexOf('.', categoriesEnd + 1);
        const exlusionStart = termsWithouthNbsp.indexOf('Exclusiones:');
        let exclusions = termsWithouthNbsp.slice(exlusionStart + 12, exlusionEnd + 1);
        let exclusionsWithoutFormat = termsWithouthNbsp.slice(exlusionStart, exlusionEnd + 1);


        //Extraccion de las observaciones en terminos y condiciones
        const observationEnd = termsWithouthNbsp.indexOf('.', categoriesEnd + 1);
        const observationStart = termsWithouthNbsp.indexOf('Observación:');
        let observation = termsWithouthNbsp.slice(observationStart + 12, observationEnd + 1);
        let observationWithoutFormat = termsWithouthNbsp.slice(observationStart, observationEnd + 1);

        if (exclusionsWithoutFormat == '') {
            exclusions = 'No Aplica';
        }

        if (observationWithoutFormat == '') {
            observation = 'No Aplica';
        }

        store = {
            'storeId': store.store_id,
            'storeDescription': descriptionWithouthNbsp,
            'cashbackMonth': month,
            'cashbackCategories': categories,
            'cashbackExlusions': exclusions,
            'cashbackObservation': observation,
            'storeImage': urlBase + store.image,
            'storeHeaderImage': urlBase + store.header_image,
            'storeName': store.name,
            'storeLink': store.url_store,
            'storelinkTraker': urlTracking,
            'storeCashback': responseCashback[0].cs_discount,
            'cashbacks': dataCashback
        };
        /** fin de reutilizaion de api-get-stores-cashback-rankmi */

        data = store;

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
        "storeId": 3
    },
    "queryStringParameters": {
        "userId": 1
    },
    "requestContext": {
        "authorizer": {
            "claims": {
                "custom:partner_id": 1
            }
        }
    }
}, {}, (e) => { console.log(e) })
    .then(res => console.log(res))
    .catch(e => console.log(e));
