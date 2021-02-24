import UserProcess from '../jobs/userProcess';
import { ch } from './queueConnection';

class ConsumeProcessor {
    private userProcessPrefectCount = 1;
    constructor() { }

    userProcess = async () => {
        ch.prefetch(this.userProcessPrefectCount);
        ch.consume('db_poll_users_test', async (msg) => {
            await new UserProcess().run(JSON.parse(msg.content.toString()));
        })
    }
}


export default ConsumeProcessor;