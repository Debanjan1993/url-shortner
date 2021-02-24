import { Connection, getConnection } from 'typeorm';
import consume from '../queueService/consume'

class UserProcess {
    previousQueueName: 'db_poll_users_test'
    currentQueue: 'db_process_users_test'
    connection: Connection
    constructor() {
        this.connection = getConnection();
    }

    run = async () => {
      const data = await consume(this.previousQueueName, 1);
      console.log(data);
    }
}

export default UserProcess;