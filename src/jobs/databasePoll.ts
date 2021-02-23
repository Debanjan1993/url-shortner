import { Connection, getConnection } from 'typeorm';
import { Users } from '../entity/Users/Users';
import { UserRepository } from '../repository/UserRepository';

class DatabasePoll {
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
        /**
         * Logic to be implemented
         */
        console.log(user.username);
    }
}

export default DatabasePoll;