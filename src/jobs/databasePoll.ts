import { Connection, getConnection } from 'typeorm';
import { Users } from '../entity/Users/Users';
import { UserRepository } from '../repository/UserRepository';
import publishToQueue from '../queueService/publish';
import JobLogger from '../Logger';

class DatabasePoll {
    routingRoute = 'db_poll_users_test_queue'
    connection: Connection
    jobLogger: JobLogger
    constructor() {
        this.connection = getConnection();
        this.jobLogger = new JobLogger('Database Poll Job');
    }
    run = async () => {
        this.jobLogger.info(`Database Poll Job started`);
        const userRepository = this.connection.getCustomRepository(UserRepository);

        const freeUserCount = await userRepository.getFreeUserCount();

        for (let i = 0; i < freeUserCount; i = i + 50) {
            const users = await userRepository.getFreeUsers(i, 50);
            await Promise.all(users.map(async user => {
                await this.sendMessagetoQueue(user);
            }));
        }

    }

    private sendMessagetoQueue = async (user: Users) => {
        const obj = {
            email: user.email,
            username: user.username
        }
        this.jobLogger.info(`Publishing message to queue for username ${obj.username}`);
        const isSent = await publishToQueue(this.routingRoute, Buffer.from(JSON.stringify(obj)));
        if (!isSent) {
            this.jobLogger.error(`Unable to put user ${obj.email} in the queue`);
        }
    }

}

export default DatabasePoll;