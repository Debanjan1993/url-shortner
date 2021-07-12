import { CronJob } from 'cron';
import DatabasePoll from './jobs/databasePoll';
import connectToDb from './postgresConnection';
import { connectToQueueServer } from './queueService/queueConnection';
import logger from 'pino';

(async function () {

    try {
        await connectToQueueServer();
        await connectToDb();

        //0 */5 * * * *
        const job = new CronJob('*/10 * * * * *', async () => {
            logger().info(`Database Poll Job Started`);
            await new DatabasePoll().run();
            logger().info(`Database Poll Job Completed`);
        }, null, true)

        job.start();
    } catch (err) {
        logger().error(`Exception while running the DatabasePoll Job : ${err}`);
    }

})();