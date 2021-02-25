import { Connection, getConnection } from "typeorm";
import { EmailObj } from '../customTypesDec/interfaceDec';
import { transporter } from '../mailTransporter';
import config from 'config';



class EmailJob {
    private connection: Connection
    constructor() {
        this.connection = getConnection();
    }

    run = async (emailObj: EmailObj) => {
        const email = emailObj.email
        const links = emailObj.links.join(',')
        const url = `${config.get<string>("baseUrl")}login`

        console.log(`Sending mail to user ${email}`);
        const info = await transporter.sendMail({

            from: '"URL Shortner Pvt Ltd" <debanjan.dey999@gmail.com>',
            to: email,
            subject: `URL's Expired`,
            text: `The follwing URl's have expired ${links}. Please upgrade to a paid account to enable them again`,
            html: `<a href="${url}">Link</a>`,

        })

        console.log(info.messageId)
    }

}

export default EmailJob;