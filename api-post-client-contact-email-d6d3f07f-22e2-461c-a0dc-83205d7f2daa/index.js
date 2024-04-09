const fetch = require('cross-fetch');

exports.handler = async (event) => {

    try {
        const subject = '¡Usuario en Contacto!';
        const { name, email, comments } = event;
        const key = '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';

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
                'Authorization': `Bearer ${key}`
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
            body: JSON.stringify(error)
        };
    }
};

exports.handler({
    "name": "fernando",
    "email": "fpacheco@wingsoft.com",
    "comments": "comentario"
}).then(res => console.log(res))
    .catch(error => console.log(error));