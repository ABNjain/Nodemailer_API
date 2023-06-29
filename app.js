const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const express = require ('express')
const fs = require('fs');
const pdf = require('html-pdf');
const app = express();
require('dotenv').config();

// const CLIENT_ID = '901945594550-m6qs62omqshhtp0ljacfdqm1u1bu84ea.apps.googleusercontent.com';
// const CLIENT_SECRET = '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';
// const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
// const REFRESH_TOKEN = '1//04rEmuBknWwl4CgYIARAAGAQSNwF-L9Ir1TgoOCHOXFuTUft88b2eRjtYq1qMfOfbdkCmW9af36I2OPGVvVtIBgEf3i27MrsnqE0';

app.get('/home', async (req,res,next)=>{
    // console.log("middle");
var html = fs.readFileSync('./invoice.html','utf-8')
let result = {
    message: "Invoice sent to your email"
}
let options = {
    format: 'Letter'
}
pdf.create(html, options).toFile('./invoice.pdf',function(err,res) {
    if (err) return console.log(err.message);
    return console.log(res);
})
res.status(200).json(result)
})

const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN, scope: SCOPES })

async function sendMail(){
    try {
        const invoicePdf = fs.readFileSync('./invoice.pdf','utf-8')
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: 'OAuth2',
                user: 'jainsaab0002@gmail.com',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: 'jainsaab0002@gmail.com',
            to: 'abnjain25@gmail.com',
            subject: 'Invoice Hereee',
            text: 'API ki taraf se Rammmm bhiyaaa kayi haal chaal',
            html: '<h1>API ki taraf se Rammmm bhiyaaa kayi haal chaal</h1>',
            attachments: [{
                filename: 'image_lio_bhiya.png',
                path: './Screenshot.png'
            },
            {
                type: 'application/pdf',
                filename: 'invoice_lio_bhiya.pdf',
                content: invoicePdf.toString('utf-8')
            }],
        };
        const result = await transport.sendMail(mailOptions)
        return result;
    } catch (error) {
        return error
    }
}

// sendMail().then((result) => console.log('Email Sent...', result))
// .catch((error) => console.log(err.message))

module.exports = app;