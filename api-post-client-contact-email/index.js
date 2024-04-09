const fetch = require('cross-fetch');

exports.handler = async (event) => {

    const sendgridApiKey = process.env.SENDGRID_API_KEY || 'Bearer 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';

    try {
        const subject = '¡Usuario en Contacto!';
        const { name, email, comments } = event;

        const data = {
            from: {
                email: 'teayudamos@iwanacash.com'
            },
            personalizations: [
                {
                    to: [
                        {
                            email: 'teayudamos@iwanacash.com'
                        }
                    ],
                    dynamic_template_data: {
                        subject,
                        name,
                        email,
                        comments
                    }
                }
            ],
            template_id: 'd-4c7205ddc24049c88a62033d21cbcd33'
        };

        const url = 'https://api.sendgrid.com/v3/mail/send';
        const init = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': sendgridApiKey
            },
            body: JSON.stringify(data)
        };

        let response = await fetch(url, init);

        if (!response.ok) {
            response = await response.json();
            throw new Error(response.errors?.[0]?.message);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ name, email, comments })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error.toString())
        };
    }
};

exports.handler({
    "name": "fernando",
    "email": "fpacheco@wingsoft.com",
    "comments": "comentario"
}).then(res => console.log(res))
    .catch(error => console.log(error));