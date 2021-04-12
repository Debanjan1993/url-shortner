import { ch } from './queueConnection';
import logger from 'pino';

const publishToQueue = async (routingKey: string, data: any): Promise<boolean> => {
    try {
        const isSent = ch.publish('test_url', 'db_confirmation_mail_test_key', data, { persistent: true });
        logger().info(`isSent : ${isSent}`)
        return isSent
    } catch (e) {
        logger().error(e);
        return false;
    }
}

export default publishToQueue;