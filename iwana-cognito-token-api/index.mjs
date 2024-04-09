import AWS from 'aws-sdk';
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' });

export const handler = (event, context, callback) => {
    const data = {}, message = 'Auth success', httpStatus = 200;

    const { username, password } = JSON.parse(event?.body || null);

    if (username == null || password == null) {
        return callback && callback(null, {
            statusCode: 400,
            body: JSON.stringify({ httpStatus: 400, message: 'All fields are required', error: context })
        });
    }

    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: process.env.clientId,
        AuthParameters: {
            'USERNAME': username,
            'PASSWORD': password
        }
    };

    cognitoIdentityServiceProvider.initiateAuth(params, (errorCognito, dataCognito) => {
        if (errorCognito) {
            return callback && callback(null, {
                statusCode: errorCognito.statusCode,
                body: JSON.stringify({ httpStatus: errorCognito.statusCode, message: errorCognito.message, error: errorCognito })
            });
        }

        data.token = dataCognito && dataCognito.AuthenticationResult && dataCognito.AuthenticationResult.IdToken ? dataCognito.AuthenticationResult.IdToken : null;

        callback && callback(null, {
            statusCode: httpStatus,
            body: JSON.stringify({ httpStatus, data, message })
        });
    });
};
