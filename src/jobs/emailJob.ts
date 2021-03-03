import { Connection, getConnection } from "typeorm";
import { EmailObj, ConfirmationEmail } from '../customTypesDec/interfaceDec';
import { transporter } from '../mailTransporter';
import config from 'config';



class EmailJob {
    private connection: Connection
    constructor() {
        this.connection = getConnection();
    }

    run = async (emailObj: EmailObj) => {
        console.log(`Link Deactivatation email job started for user ${emailObj.email}`);
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

        console.log(info.messageId);
        console.log(`Link Deactivatation email job ended for user ${emailObj.email}`);
    }

    confirmationMail = async (emailObj: ConfirmationEmail) => {
        console.log(`Cofirmation email job started for user ${emailObj.email}`);
        const email = emailObj.email;
        const code = emailObj.code;
        const url = `${config.get<string>("baseUrl")}confirmation/${code}`;

        console.log(`Sending mail to user ${email}`);
        const info = await transporter.sendMail({

            from: '"URL Shortner Pvt Ltd" <debanjan.dey999@gmail.com>',
            to: email,
            subject: `Account Confirmation Mail`,
            text: `Please click on the link below to confirm your account`,
            html: `<a href="${url}">Link</a>`,

        })

        console.log(info.messageId);
        console.log(`Cofirmation email job ended for user ${emailObj.email}`);
    }

}

export default EmailJob;