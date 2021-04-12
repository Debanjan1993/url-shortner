import { CronJob } from 'cron';
import connectToDb from './postgresConnection';
import { connectToQueueServer } from './queueService/queueConnection';
import ConsumeProcessor from './queueService/consumeProcessor';
import { enableTransporter } from './mailTransporter';
import logger from 'pino';

(async function () {

    await connectToQueueServer();
    await connectToDb();
    await enableTransporter();


    new CronJob('*/20 * * * * *', async () => {
        await new ConsumeProcessor().userMail();
    }, () => {
        logger().info(`User Mail Job Completed`)
    }, true)

    new CronJob('*/20 * * * * *', async () => {
        await new ConsumeProcessor().confirmationMail();
    }, () => {
        logger().info(`Confirmation Mail Job Completed`)
    }, true)

})();