import AWS from 'aws-sdk';
const { CognitoIdentityServiceProvider } = AWS;
import fetch from 'cross-fetch';
const Cognito = new CognitoIdentityServiceProvider();
import { ErrorException } from './ErrorException.mjs';

var isProd = false;

function generatePassword() {
    return (
        `${Math.random().toString(36).slice(2)}*${Math.random().toString(36).toUpperCase().slice(2)}`
    );
}

async function userCognito(email, password, partnerId, country) {
    const cognitoParams = {
        UserPoolId: 'us-east-1_TQpqG2w7d',
        Username: email,
        DesiredDeliveryMediums: ['EMAIL'],
        MessageAction: 'SUPPRESS',
        UserAttributes: [
            {
                Name: 'email',
                Value: email,
            },
            {
                Name: 'custom:countryCode',
                Value: country
            },
            {
                Name: 'custom:partner_id',
                Value: partnerId
            },
            {
                Name: 'custom:name',
                Value: email
            },
            {
                Name: 'email_verified',
                Value: 'true'
            }
        ]
    };

    // await with .promise()
    const cognitoResponse = await Cognito.adminCreateUser(
        cognitoParams
    ).promise();

    const params = {
        Password: password,
        UserPoolId: 'us-east-1_TQpqG2w7d',
        Username: email,
        Permanent: true
    };

    await Cognito.adminSetUserPassword(
        params
    ).promise();

    return cognitoResponse;
}

async function existUser(email) {
    const url = isProd ?
        `https://jdf5egxrj5.execute-api.us-east-1.amazonaws.com/default/users-prod/${email}` :
        `https://jdf5egxrj5.execute-api.us-east-1.amazonaws.com/default/users/${email}`;

    try {
        const request = await fetch(url, {
            mode: 'cors',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const body = await request.json();
        return body;
    } catch (error) {
        console.log('error fetch', error);
    }
}

async function createUserLegacy(name, email, password, partnerId, country) {
    const url = isProd ?
        'https://jdf5egxrj5.execute-api.us-east-1.amazonaws.com/default/users-postgres-prod' :
        'https://jdf5egxrj5.execute-api.us-east-1.amazonaws.com/default/users-postgres';


    const data = {
        name,
        email,
        provider: "normal",
        providerId: "normal",
        password,
        roleId: 2,
        countryId: country === 'CL' ? 1 : 2,
        isActive: true,
        confirmed: true,
        confirmEmail: email,
        isFintonic: false,
        partnerId
    };

    const request = await fetch(url, {
        mode: 'no-cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(data)
    })
        .then(res => res.json())
        .catch(() => null);

    return request;
}

async function sendSegmentSignup(userId, email) {
    const url = 'https://wjbzqq3w0j.execute-api.us-east-1.amazonaws.com/dev/segment/backend';
    const body = {
        typeEvent: 'Track',
        message: {
            userId: userId,
            event: 'signup',
            properties: {
                email: email,
                typeSignUp: 'partner-dev',
                webVersion: 'none'
            }
        }
    };

    const params = {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    await fetch(url, params);
}

/**
 * @type { import('aws-lambda').Handler }
 * @param { import('aws-lambda').APIGatewayEvent } event
 * @param { import('aws-lambda').Context } context
 * @return { import('aws-lambda').APIGatewayProxyResult}
 */
export const handler = async (event, context) => {
    try {
        const httpStatus = 201, message = 'User created';
        let data = {};
        isProd = context.functionName.includes('prod');

        const fields = JSON.parse(event?.body || null);

        const name = fields?.name || null;
        let email = fields?.email || null;

        if (
            name === null ||
            email === null
        ) {
            throw new ErrorException(400, 'All fields are required', context);
        }

        email = email.trim().replace(/ /g, "+");

        const country = event?.requestContext?.authorizer?.claims['custom:countryCode'] || 'CL';
        const partnerId = event?.requestContext?.authorizer?.claims['custom:partner_id'] || null;

        if (partnerId === null) {
            throw new ErrorException(403, 'partner can\'t be undefined', context);
        }

        const password = generatePassword();

        const oldUSer = await existUser(email);

        if (oldUSer.httpStatus === 200) {
            return {
                statusCode: 200,
                body: JSON.stringify(oldUSer)
            };
        }

        if (isProd) {
            const existCognito = await userCognito(email, password, partnerId, country);

            if (!existCognito?.User) {
                throw new ErrorException(400, 'User not created', context);
            }
        }

        const user = await createUserLegacy(name, email, password, partnerId, country);

        if (user === null) {
            throw new ErrorException(400, 'User not created', context);
        }

        const id = user.data.id;

        data = {
            id,
            email: user.data.email,
            // password,
            iwanaExists: false
        };

        await sendSegmentSignup(id, email);

        return {
            statusCode: httpStatus,
            body: JSON.stringify({ httpStatus, message, data })
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
/* //local test
handler({
    "requestContext": {
        "authorizer": {
            "claims": {
                "custom:partner_id": "1"
            }
        }
    },
        "body": "{\r\n    \"name\": \"name\",\r\n    \"email\": \"joseprado@correo12045.com\",\r\n  \"partnerId\": 2\r\n}"
    }, {})
    .then(res => console.log(res))
    .catch(e => console.log(e));
*/