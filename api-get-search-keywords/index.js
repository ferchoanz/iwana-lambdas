const { Client } = require("pg");

exports.handler = async (event) => {
    const client = new Client({
        user: process.env.PGUSER || 'iwana_cashback',
        host: process.env.PGHOST || 'iwanacashback.csapwwufkkn0.us-east-1.rds.amazonaws.com',
        database: process.env.PGDATABASE || 'iwana',
        password: process.env.PGPASSWORD || 'IwAnA128379823$%cashBaCk$)#',
        port: 5432
    });

    let statusCode, body, message, response, count = 0;
    let data = [];

    try {
        let countryId = event.queryStringParameters.countryId; //Parametro que viene del endpoint
        countryId = countryId.trim(); // Borra los caracteres vacios en los extremos
        let keyword = event.queryStringParameters.keyword;
        keyword = keyword.trim();
        keyword = keyword.toUpperCase();

        //BD Conn
        await client.connect(function (err) {
            if (err) {
                console.log(err);
            }
        });

        const result = await client.query(`
            SELECT DISTINCT
                s.id as "storeId",
                s.name as "storeName"
            FROM
                store_keywords sk
            INNER JOIN
                stores s ON s.id = sk.store_id
            WHERE
                s.pais_id = ${countryId}
                AND s.is_active = true
                AND (upper(sk.keyword)) LIKE '%${keyword}%'
            ORDER BY s.name ASC
            LIMIT 20
        `);

        response = result.rows || [];

        data = response;
        count = data.length;
        body = {
            statusCode: 200,
            count,
            data
        };

        client.end();
    }
    catch (e) { // valdicacion de errores
        body = {
            message: "Something has gone wrong",
            statusCode: 500,
            data: e.message,
        };
    }
    finally {
        body = JSON.stringify(body);
    }

    return {
        headers: {
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        },
        message,
        statusCode,
        body,
    };
};

exports.handler({ queryStringParameters: { keyword: 'a', countryId: "1" } }).then(e => console.log(e));