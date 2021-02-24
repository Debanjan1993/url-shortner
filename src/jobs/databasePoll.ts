import { Connection, getConnection } from 'typeorm';
import { Users } from '../entity/Users/Users';
import { UserRepository } from '../repository/UserRepository';
import publishToQueue from '../queueService/publish';

class DatabasePoll {
    routingRoute: 'db_poll_users_test_key'
    connection: Connection
    constructor() {
        this.connection = getConnection();
    }
    run = async () => {
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
        console.log(`Publishing message to queue for username ${obj.username}`);
        const isSent = await publishToQueue(this.routingRoute, Buffer.from(JSON.stringify(obj)));
        if (!isSent) {
            console.log(`Unable to put user ${obj.email} in the queue`);
        }
    }

}

export default DatabasePoll;