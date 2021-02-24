import { ch } from './queueConnection';

const publishToQueue = async (routingKey: string, data: any): Promise<boolean> => {
    try {
        const isSent = ch.publish('test_url', 'db_poll_users_test_key', data, { persistent: true });
        console.log(`isSent : ${isSent}`)
        return isSent
    } catch (e) {
        console.error(e);
        return false;
    }
}

export default publishToQueue;