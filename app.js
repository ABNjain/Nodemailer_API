const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = '901945594550-m6qs62omqshhtp0ljacfdqm1u1bu84ea.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04rEmuBknWwl4CgYIARAAGAQSNwF-L9Ir1TgoOCHOXFuTUft88b2eRjtYq1qMfOfbdkCmW9af36I2OPGVvVtIBgEf3i27MrsnqE0';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN, scope: SCOPES })

async function sendMail(){
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: 'OAuth2',
                user: 'jainsaab0002@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: 'jainsaab0002@gmail.com',
            to: 'ksarathe9@gmail.com',
            subject: 'Sarathe Ji ko raammmmm',
            text: 'API ki taraf se Rammmm bhiyaaa kayi haal chaal',
            html: '<h1>API ki taraf se Rammmm bhiyaaa kayi haal chaal</h1>',
            attachments: [{
                filename: 'image_lio_bhiya.png',
                path: './Screenshot.png'
            }]
        };
        const result = await transport.sendMail(mailOptions)
        return result;
    } catch (error) {
        return error
    }
}

sendMail().then((result) => console.log('Email Sent...', result))
.catch((error) => console.log(err.message))