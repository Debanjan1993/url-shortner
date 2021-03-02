import redis, { RedisClient } from 'redis';
import config from 'config';

let redisClient: RedisClient = null;
const connectRedisDb = async () => {
    const client = redis.createClient({
        url: config.get<string>("redis.url")
    })

    client.on("error", err => {
        console.error(err);
    })

    client.on('connect', () => {
        redisClient = client;
        console.log(`Connected to the redis DB`);
    })
}

export { redisClient, connectRedisDb };