import { CronJob } from 'cron';
import connectToDb from './postgresConnection';
import { connectToQueueServer } from './queueService/queueConnection';
import ConsumeProcessor from './queueService/consumeProcessor';
import { enableTransporter } from './mailTransporter';

(async function () {

    await connectToQueueServer();
    await connectToDb();
    await enableTransporter();


    new CronJob('*/20 * * * * *', async () => {
        await new ConsumeProcessor().userMail();
    }, () => {
        console.log(`User Mail Job Completed`)
    }, true)

    new CronJob('*/20 * * * * *', async () => {
        await new ConsumeProcessor().confirmationMail();
    }, () => {
        console.log(`Confirmation Mail Job Completed`)
    }, true)

})();