import pkg from 'pg';
const { Client } = pkg;
import { hashSync } from "bcrypt";
import { ErrorException } from './ErrorException.mjs';

export const handler = async (event, context) => {

    const client = new Client({
        user: process.env.PGUSER || 'iwana_cashback',
        host: process.env.PGHOST || 'iwanacashback.csapwwufkkn0.us-east-1.rds.amazonaws.com',
        database: process.env.PGDATABASE || 'iwana',
        password: process.env.PGPASSWORD || 'IwAnA128379823$%cashBaCk$)#',
        port: 5432
    });

    const httpStatus = 201, message = 'User created', saltRounds = 10;
    let data = {};

    try {
       await client.connect((err) => {
            if (err) {
                throw new ErrorException(500, 'Internal Server Error', err);
            }
        });

        const fields = JSON.parse(event?.body || null);

        const name = fields.name;
        const email = fields.email;
        const provider = fields.provider;
        const providerId = fields.providerId;
        const password = hashSync(fields.password, saltRounds);
        const roleId = fields.roleId;
        const countryId = fields.countryId;
        const isActive = fields.isActive;
        const confirmed = fields.confirmed;
        const confirmEmail = fields.confirmEmail;
        const isFintonic = fields.isFintonic ?? false;
        const partnerId = fields.partnerId;

        const user = await client.query(`
            INSERT INTO users
                (
                    "name",
                    email,
                    provider,
                    provider_id,
                    "password",
                    role_id,
                    is_active,
                    pais_id,
                    confirmed,
                    confirm_email,
                    is_fintonic,
                    partner_id,
                    created_at,
                    updated_at
                )
                VALUES
                (
                    '${name}',
                    '${email}',
                    '${provider}',
                    '${providerId}',
                    '${password}',
                    ${roleId},
                    ${isActive},
                    ${countryId},
                    ${confirmed},'
                    ${confirmEmail}',
                    ${isFintonic},
                    ${partnerId},
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP
                )
            RETURNING *
        `);

        if (user.rowCount === 0) {
            throw new ErrorException(400, 'User not created', context);
        }

        data = user.rows[0];
        client.end();

        return {
            statusCode: httpStatus,
            body: JSON.stringify({ httpStatus, message, data })
        };

    } catch (error) {
        return {
            statusCode: error.httpStatus || 500,
            body: JSON.stringify(error)
        };
    }
};

handler({
    "body": "{\r\n    \"name\": \"name\",\r\n    \"email\": \"email\",\r\n    \"provider\": \"normal\",\r\n    \"providerId\": \"normal\",\r\n    \"password\": \"password\",\r\n    \"roleId\": 2,\r\n    \"countryId\": 1,\r\n    \"isActive\": true,\r\n    \"confirmed\": true,\r\n    \"confirmEmail\": \"email\",\r\n    \"isFintonic\": false,\r\n    \"partnerId\": 2\r\n}"
}, {})
.then(res => console.log(res))
.catch(e => console.log(e));
