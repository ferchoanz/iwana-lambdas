const fetch = require('cross-fetch');
const { Client } = require('pg');

exports.handler = async (event, context) => {

    const sendgridApiKey = process.env.SENDGRID_API_KEY;

    const client = new Client({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: 5432
    });

    const isEmailCognito = event?.userPoolId === 'us-east-1_T0kYRZtHy' && (event?.triggerSource === 'PreSignUp_AdminCreateUser' || event?.triggerSource === "PreSignUp_ExternalProvider");

    try {
        const subject = '¡Bienvenido a Iwanacash!';
        const requestJSON = isEmailCognito ? {
            userName: event?.request?.userAttributes?.['custom:name'],
            email: event?.request?.userAttributes?.email,
            template: '' 
        } : JSON.parse(event.body);

        var user = {
            userName: requestJSON.userName,
            email: requestJSON.email,
            template: requestJSON.template,
            sendgridTemplateId: 'd-86913aa299a14b89a1521520d614eefe'
        };

        await client.connect(function (err) {
            if (err) {
                console.log(err);
            }
        });

        const userEmail = requestJSON.email.trim();
        const query = `
            select
                pc.value
            from
                users u
            inner join
                partners p on p.id = u.partner_id
            inner join
                partner_configs pc on pc.partner_id = p.id 
            inner join
                partner_config_types pct on pct.id = pc.partner_config_type_id 
            where
                u.email = '${userEmail}'
            and partner_config_type_id = 1
        `;

        const result = await client.query(query);
        const queryResponse = result.rows[0];

        if (queryResponse) {
            user.sendgridTemplateId = queryResponse.value;
        }

        const data = {
            from: {
                email: 'notificaciones@iwanacash.com',
            },
            personalizations: [
                {
                    to: [
                        {
                            email: user.email,
                        }
                    ],
                    dynamic_template_data: {
                        subject: subject,
                        userName: user.userName,
                    }
                }
            ],
            template_id: user.sendgridTemplateId
        };

        const url = 'https://api.sendgrid.com/v3/mail/send';
        let init = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': sendgridApiKey
            },
            body: JSON.stringify(data)
        };
        
        const queryUser = await client.query(`
            select
                partner_id
            from
                users
            where
                email = '${userEmail}'
            limit 1
        `).then(response => response?.rows?.[0]);
        
        
        if (queryUser?.partner_id !== 4)
            await fetch(url, init);
    
    } catch (e) {
        console.log({event: JSON.stringify(event)});
        console.log(e);
    }

    const res = {
        statusCode: 200,
        body: JSON.stringify(user),
    };

    return isEmailCognito ? context.succeed(event) : res;
};
