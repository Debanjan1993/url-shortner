import nodemailer from 'nodemailer';
import config from 'config';
import Mail from 'nodemailer/lib/mailer';

let transporter: Mail = null;
const enableTransporter = async () => {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.get<string>("emailUsername"),
            pass: config.get<string>("emailPassword")
        }
    })
}

export { transporter, enableTransporter };