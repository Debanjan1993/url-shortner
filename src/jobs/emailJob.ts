import { Connection, getConnection } from "typeorm";
import { EmailObj, ConfirmationEmail } from '../customTypesDec/interfaceDec';
import { transporter } from '../mailTransporter';
import config from 'config';
import JobLogger from "../Logger";

class EmailJob {
    private connection: Connection
    private jobLogger: JobLogger
    constructor() {
        this.connection = getConnection();
        this.jobLogger = new JobLogger('Email Job');
    }

    run = async (emailObj: EmailObj) => {
        try {
            this.jobLogger.info(`Link Deactivatation email job started for user ${emailObj.email}`);
            const email = emailObj.email
            const links = emailObj.links.join(',')
            const url = `${config.get<string>("baseUrl")}login`

            const info = await transporter.sendMail({

                from: '"URL Shortner Pvt Ltd" <debanjan.dey999@gmail.com>',
                to: email,
                subject: `URL's Expired`,
                text: `The follwing URl's have expired ${links}. Please upgrade to a paid account to enable them again`,
                html: `<a href="${url}">Link</a>`,

            })

            this.jobLogger.info(info.messageId);
            this.jobLogger.info(`Link Deactivatation email job ended for user ${emailObj.email}`);
        } catch (err) {
            this.jobLogger.error(`Exception : ${err}`);
        }
    }

    confirmationMail = async (emailObj: ConfirmationEmail) => {
        try {
            this.jobLogger.info(`Cofirmation email job started for user ${emailObj.email}`);
            const email = emailObj.email;
            const code = emailObj.code;
            const url = `${config.get<string>("baseUrl")}confirmation/${code}`;

            this.jobLogger.info(`Sending mail to user ${email}`);
            const info = await transporter.sendMail({

                from: '"URL Shortner Pvt Ltd" <debanjan.dey999@gmail.com>',
                to: email,
                subject: `Account Confirmation Mail`,
                text: `Please click on the link below to confirm your account`,
                html: `<head>Please click on the link below to confirm your account with URL Shortner Pvt Ltd<head><br><a href="${url}">Link</a>`,

            })

            this.jobLogger.info(info.messageId);
            this.jobLogger.info(`Cofirmation email job ended for user ${emailObj.email}`);
        } catch (err) {
            this.jobLogger.error(`Exception : ${err}`);
        }
    }

}

export default EmailJob;