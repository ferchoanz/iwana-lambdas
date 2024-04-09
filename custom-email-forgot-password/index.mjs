import fs from 'fs';
const forgotPasswordTemplate = fs.readFileSync('./forgot_password_template.html', 'utf8');
export const handler = (event, context, callback) => {

    if (event.userPoolId === 'us-east-1_T0kYRZtHy') {
        // Identify why was this function invoked
        if (event.triggerSource === 'CustomMessage_ForgotPassword') {
            // Ensure that your message contains event.request.codeParameter. This is the placeholder for code that will be sent
            let finalTemplate = forgotPasswordTemplate.replace('{{userName}}', event.request.userAttributes['custom:name']);
            finalTemplate = finalTemplate.replace('{{recoverCode}}', event.request.codeParameter);
            event.response.smsMessage = "Welcome to the service. Your confirmation code is " + event.request.codeParameter;
            event.response.emailSubject = "Hola! Tu código para restablecer contraseña en IwanaCash";
            event.response.emailMessage = finalTemplate;
        }
        // Create custom message for other events
    }
    // Customize messages for other user pools

    // Return to Amazon Cognito
    callback(null, event);
};