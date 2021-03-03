import UserProcess from '../jobs/userProcess';
import EmailJob from '../jobs/emailJob';
import { ch } from './queueConnection';

class ConsumeProcessor {
    private userProcessPrefectCount = 1;
    private userMailPrefetchCount = 1;
    private userConfirmationPrefetchCount = 1;
    constructor() { }

    userProcess = async () => {
        ch.prefetch(this.userProcessPrefectCount);
        ch.consume('db_poll_users_test', async (msg) => {
            await new UserProcess().run(JSON.parse(msg.content.toString()));
        })
    }

    userMail = async () => {
        ch.prefetch(this.userMailPrefetchCount);
        ch.consume('db_mail_users_test', async (msg) => {
            await new EmailJob().run(JSON.parse(msg.content.toString()));
        })
    }

    confirmationMail = async () => {
        ch.prefetch(this.userConfirmationPrefetchCount);
        ch.consume('db_confirmation_mail_test', async (msg) => {
            await new EmailJob().confirmationMail(JSON.parse(msg.content.toString()));
        })
    }
}


export default ConsumeProcessor;