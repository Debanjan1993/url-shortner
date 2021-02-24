import { ch } from './queueConnection';

const consume = async (queueName: string, messageCount: number) => {
    ch.prefetch(messageCount);
    let message = undefined;
    ch.consume('db_poll_users_test', (msg) => {
        const input = msg.content.toString();
        return input;
    })
}

export default consume;