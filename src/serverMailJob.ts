import { CronJob } from 'cron';
import connectToDb from './postgresConnection';
import { connectToQueueServer } from './queueService/queueConnection';
import ConsumeProcessor from './queueService/consumeProcessor';
import { enableTransporter } from './mailTransporter';
import logger from 'pino';

(async function () {

    try {
        await connectToQueueServer();
        await connectToDb();
        await enableTransporter();


        new CronJob('*/20 * * * * *', async () => {
            logger().info(`User Mail Job Started`);
            await new ConsumeProcessor().userMail();
            logger().info(`User Mail Job Completed`);
        }, null, true)

        new CronJob('*/20 * * * * *', async () => {
            logger().info(`Confirmation Mail Job Started`);
            await new ConsumeProcessor().confirmationMail();
            logger().info(`Confirmation Mail Job Completed`);
        }, null, true)

    } catch (err) {
        logger().error(`Exception while running the Mail Job : ${err}`);
    }

})();