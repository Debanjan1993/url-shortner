import { CronJob } from 'cron';
import connectToDb from './postgresConnection';
import { connectToQueueServer } from './queueService/queueConnection';
import ConsumeProcessor from './queueService/consumeProcessor';
import logger from 'pino';

(async function () {
    try {
        await connectToQueueServer();
        await connectToDb();

        const job = new CronJob('*/20 * * * * *', async () => {
            logger().info(`User Process Job Started`);
            await new ConsumeProcessor().userProcess();
            logger().info(`User Process Job Completed`);
        }, null, true)

        job.start();
    } catch (err) {
        logger().error(`Exception : ${err}`);
    }

})();