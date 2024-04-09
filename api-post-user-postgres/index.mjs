import pkg from 'pg';
const { Client } = pkg;
import bcryptjspkg from 'bcryptjs';
const { hashSync } = bcryptjspkg ;

export const handler = async (event) => {
    const client = new Client({
        user: process.env.PGUSER|| 'iwana_cashback',
        host: process.env.PGHOST|| 'iwana.csapwwufkkn0.us-east-1.rds.amazonaws.com',
        database: process.env.PGDATABASE || 'iwana',
        password: process.env.PGPASSWORD || 'IwAnA128379823$%cashBaCk$)#',
        port: 5432
    });
    var statusCode, message;
    var data = {};
    const saltRounds = 10;

    try {

        //BD Conn
        await client.connect(function (err) {
            if (err) {
                console.log(err);
            }
        });

        const name = event.name;
        const email = event.email;
        const provider = event.provider;
        const providerId = event.providerId;
        const password = hashSync(event.password, saltRounds);
        const roleId = event.roleId;
        const countryId = event.countryId;
        const isActive = event.isActive;
        const confirmed = event.confirmed;
        const confirmEmail = event.confirmEmail;
        const isFintonic = event.isFintonic ?? false;
        const partnerId = event.partnerId ?? 3;
        const created_at = 'CURRENT_TIMESTAMP';
        const updated_at = 'CURRENT_TIMESTAMP';

        const columns = '"name" , email, provider,provider_id, "password", role_id, is_active, pais_id, confirmed, confirm_email, created_at, updated_at, is_fintonic, partner_id';
        const table = "users";
        const values = `'${name}','${email}','${provider}','${providerId}','${password}',${roleId},${isActive},${countryId},${confirmed},'${confirmEmail}', ${created_at}, ${updated_at}, ${isFintonic}, ${partnerId}`;

        const result = await client.query(`INSERT INTO ${table}(${columns}) VALUES(${values}) RETURNING id`);

        if (result.rowCount == 1) { //si crea al usuario
            const res = result.rows[0];
            delete event.password;
            event.userId = res.id;
            message = "User created";
            statusCode = 201;
            data = event;

        } else { // Si no crea al usuario
            message = "User not created";
            statusCode = 400;
            data = {};
        }

    } catch (e) { // valdicacion de errores
        message = "Something has gone wrong";
        statusCode = 500;
        data = e.message;
    } finally {
        client.end();
    }

    return {
        message,
        statusCode,
        data,
    };
};

handler({
    "name": "pepito",
    "email": "jerof24354@rentaen.com",
    "provider": "normal",
    "providerId": "normal",
    "password": "password",
    "roleId": 2,
    "countryId": 1,
    "isActive": true,
    "confirmed": true,
    "confirmEmail": "jerof24354@rentaen.com"
})
.then(r => console.log(r))
.catch(e => console.log(e));