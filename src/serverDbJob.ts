import { CronJob } from 'cron';
import DatabasePoll from './jobs/databasePoll';
import connectToDb from './postgresConnection';


(async function () {

    await connectToDb();

    const job = new CronJob('0 */5 * * * *', async () => {
        await new DatabasePoll().run();
    }, () => {
        console.log(`Database Poll Job Completed`)
    }, true)

    job.start();

})();