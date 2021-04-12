import redis, { RedisClient } from 'redis';
import config from 'config';
import logger from 'pino';

let redisClient: RedisClient = null;
const connectRedisDb = async () => {
    const client = redis.createClient({
        url: config.get<string>("redis.url")
    })

    client.on("error", err => {
        logger().error(err);
    })

    client.on('connect', () => {
        redisClient = client;
        logger().info(`Connected to the redis DB`);
    })
}

export { redisClient, connectRedisDb };