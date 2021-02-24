import { CronJob } from 'cron';
import DatabasePoll from './jobs/databasePoll';
import connectToDb from './postgresConnection';
import { connectToQueueServer } from './queueService/queueConnection';


(async function () {

    await connectToQueueServer();
    await connectToDb();

    //0 */5 * * * *
    const job = new CronJob('*/10 * * * * *', async () => {
        await new DatabasePoll().run();
    }, () => {
        console.log(`Database Poll Job Completed`)
    }, true)

    job.start();

})();