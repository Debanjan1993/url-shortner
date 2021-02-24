import { CronJob } from 'cron';
import UserProcess from './jobs/userProcess';
import connectToDb from './postgresConnection';
import { connectToQueueServer } from './queueService/queueConnection';


(async function () {

    await connectToQueueServer();
    await connectToDb();

    const job = new CronJob('*/10 * * * * *', async () => {
        await new UserProcess().run();
    }, () => {
        console.log(`Database Poll Job Completed`)
    }, true)

    job.start();

})();