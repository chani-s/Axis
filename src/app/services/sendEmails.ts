"use server"
const nodemailer = require('nodemailer');
import fs from 'fs';
import path from 'path';

async function sendEmail(to: string, subject: string, text: string) {
    if (!to || !subject || !text) {
        throw new Error('Missing required parameters');
    }
    if (!validateEmail(to)) {
        throw new Error('Invalid email format');
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const logoPath = path.join(process.cwd(), 'public/imgs/nonebg1.png');
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');

    const emailBody = `
    <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; line-height: 1.5;">
        <p>שלום,</p>
        <p>זוהי הודעה מ-<strong>AXIS</strong>:</p>
        <p>${text}</p>
        <br>
        <p>בברכה,</p>
        <p>צוות AXIS</p>
        <br>
        <img src="cid:logo@logo.com" alt="AXIS Logo" style="width: 150px; height: auto; margin-top: 5px;">
    </div>
`;

    const attachments = [{
        filename: 'logo.png',
        path: path.join(process.cwd(), 'public/imgs/nonebg1.png'),
        cid: 'logo@logo.com'
    }];

    let mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: to,
        subject: subject,
        html: emailBody,
        attachments: attachments
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
        throw new Error('Failed to send email');
    }
}

function validateEmail(to: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(to);
}

export default sendEmail;