import { CronJob } from 'cron';
import connectToDb from './postgresConnection';
import { connectToQueueServer } from './queueService/queueConnection';
import ConsumeProcessor from './queueService/consumeProcessor';
import logger from 'pino';

(async function () {

    await connectToQueueServer();
    await connectToDb();

    const job = new CronJob('*/20 * * * * *', async () => {
        await new ConsumeProcessor().userProcess();
    }, () => {
        logger().info(`User Process Job Completed`);
    }, true)

    job.start();

})();