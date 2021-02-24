import { CronJob } from 'cron';
import connectToDb from './postgresConnection';
import { connectToQueueServer } from './queueService/queueConnection';
import ConsumeProcessor from './queueService/consumeProcessor'

(async function () {

    await connectToQueueServer();
    await connectToDb();

    const job = new CronJob('*/20 * * * * *', async () => {
        await new ConsumeProcessor().userProcess();
    }, () => {
        console.log(`User Process Job Completed`)
    }, true)

    job.start();

})();