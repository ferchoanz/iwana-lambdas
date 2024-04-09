import pkg from 'pg';
const { Client } = pkg;
import { ErrorException } from './ErrorException.mjs';

/**
 * @type { import('aws-lambda').Handler }
 * @param { import('aws-lambda').APIGatewayEvent } event
 * @param { import('aws-lambda').Context } context
 * @return { import('aws-lambda').APIGatewayProxyResult }
 */
export const handler = async (event, context) => {

    const client = new Client({
        user: process.env.PGUSER || 'iwana_cashback',
        host: process.env.PGHOST || 'iwanacashback.csapwwufkkn0.us-east-1.rds.amazonaws.com',
        database: process.env.PGDATABASE || 'iwana',
        password: process.env.PGPASSWORD || 'IwAnA128379823$%cashBaCk$)#',
        port: 5432
    });

    let responseStore, resultStore;
    const httpStatus = 200, data = [];

    try {
        await client.connect((err) => {
            if (err) {
                throw new ErrorException(500, 'Internal Server Error', err);
            }
        });

        const params = event.queryStringParameters;
        const page = Number(params?.page) || 1;
        const perPage = Number(params?.perPage) || 30;
        const userId = params?.userId || null;
        const countryId = params?.countryId || 1;
        const name = params?.name || null;
        const categories = event?.multiValueQueryStringParameters?.categories || [];
        let totalItems = null;
        const partnerId = event?.requestContext?.authorizer?.claims['custom:partner_id'] || null;
        const urlSplash = process.env.URLSPLASH || 'https://splash-dev.iwanacash.com';

        if (userId === null) {
            throw new ErrorException(400, 'userId is required', context);
        }

        if (partnerId === null) {
            throw new ErrorException(403, 'partner can\'t be undefined', context);
        }

        let exceptions = await client.query(`
            SELECT store_id FROM partner_store_exceptions WHERE partner_id = ${partnerId} GROUP BY  partner_id, store_id
        `);
        exceptions = exceptions.rowCount > 0 ? exceptions.rows.map(row => row.store_id) : [];
        const exceptionCondition = exceptions.length > 0 ? ` AND s.id NOT IN (${exceptions.join(',')})` : '';

        const columns = 's.id as store_id, s.image, s.name, s.url_store, s.terms, s.description, s.link, s.discount, s.header_image, array_agg(distinct sk.keyword) as keywords';
        const tables = `
            stores s
                LEFT JOIN stores_categories sc on s.id = sc.store_id
                LEFT JOIN store_keywords sk on s.id = sk.store_id AND sk.keyword != ''
                LEFT JOIN categories c on c.id = sc.category_id
                LEFT JOIN orderby_partner_store ops on ops.partner_id = ${partnerId} and ops.store_id = s.id
        `;
        
        const categoryCondition = categories && categories.length ? ` AND c.id IN (${categories.join(',')})` : '';
        const nameCondition = name ? ` AND LOWER(s.name) LIKE '%${String(name).toLowerCase()}%'` : '';
        const conditions = `s.pais_id = ${countryId} AND s.is_active = true` + categoryCondition + nameCondition + exceptionCondition;
        const groupBy = 's.id, s.image, s.name, s.url_store, s.terms, s.description, s.link, s.discount, s.header_image, ops.weight';
        const order = '(CASE WHEN ops.weight IS NULL THEN 9999 ELSE ops.weight END) ASC';
        const pagination = `LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;

        resultStore = await client.query(`SELECT ${columns} FROM ${tables} WHERE ${conditions} GROUP BY ${groupBy} ORDER BY ${order} ${pagination}`);
        responseStore = resultStore.rows;

        totalItems = await client.query(`SELECT COUNT(DISTINCT s.id) as total FROM ${tables} WHERE ${conditions}`);
        totalItems = totalItems.rowCount > 0 ? Number(totalItems.rows[0].total) : 0;
        const totalPage = Math.ceil(totalItems / perPage);

        await Promise.all(responseStore.map(async (element) => {

            const idStore = element.store_id.toString();
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
            and c.store_id = ${element.store_id}`;
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

            const termsWithouthTags = element.terms.replace(/(<([^>]+)>)/gi, ''); // Quita las etiquetas HTML
            let termsWithouthNbsp = termsWithouthTags.replace(/&nbsp;/g, '');
            const descriptionWithouthTags = element.description.replace(/(<([^>]+)>)/gi, '');
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
                exclusions = "No Aplica";
            }

            if (observationWithoutFormat == '') {
                observation = 'No Aplica';
            }

            let store = {
                'storeId': element.store_id,
                'storeDescription': descriptionWithouthNbsp,
                'cashbackMonth': month,
                'cashbackCategories': categories,
                'cashbackExlusions': exclusions,
                'cashbackObservation': observation,
                'storeImage': urlBase + element.image,
                'storeHeaderImage': urlBase + element.header_image,
                'storeName': element.name,
                'storeLink': element.url_store,
                'storelinkTraker': urlTracking,
                'storeCashback': responseCashback?.[0]?.cs_discount,
                'cashbacks': dataCashback,
                'keywords': element.keywords
            };

            data.push(store);
        }));

        client.end();
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
        "perPage": "1",
        "page": "1",
        //"name": "paris",
    },
    "multiValueQueryStringParameters": {
        // "categories": ['48', '12']
    },
    "requestContext": {
        "authorizer": {
            "claims": {
                "custom:partner_id": "4"
            }
        }
    }
},
    {})
    .then(res => console.log(res))
    .catch(e => console.log(e));

/**
 select
	s.id as store_id,
	s.image,
	s.name,
	s.url_store,
	s.terms,
	s.description,
	s.link,
	s.discount,
	s.header_image,
	array_agg(distinct sk.keyword) as keywords,
	case when ops.weight is null then 9999 else ops.weight end as weight
from
	stores s
left join stores_categories sc on
	s.id = sc.store_id
left join categories c on
	c.id = sc.category_id
left join
	orderby_partner_store ops on ops.partner_id = 5 and ops.store_id = s.id
LEFT JOIN store_keywords sk on s.id = sk.store_id AND sk.keyword != ''
where
	s.pais_id = 1
	and s.is_active = true
group by
	s.id,
	s.image,
	s.name,
	s.url_store,
	s.terms,
	s.description,
	s.link,
	s.discount,
	s.header_image,
	ops.weight
order by
	(case when ops.weight is null then 9999 else ops.weight end ) asc
 */