import redis, { RedisClient } from 'redis';
import Redlock, { Lock } from 'redlock';
import { redisClient } from './redisConnection';
import config from 'config';

class RedisService {
    private redlock: Redlock
    constructor() {
        this.redlock = new Redlock(
            [redisClient], {
            driftFactor: 0.01,
            retryCount: 1,
            retryDelay: 200,
            retryJitter: 200
        }
        )
    }

    lock = async (key: string, ttl: number): Promise<Lock> => {
        try {
            key = `${config.get<string>("mode")}-${key}}`;
            console.log(`Acquiring lock for key ${key}`);
            const redisLock: Lock = await this.redlock.lock(key, ttl);
            return redisLock;
        } catch (e) {
            console.error(`Error occurred while acquiring redis lock ${e}`);
            return undefined;
        }
    }

    releaseLock = async (lock: Lock) => {
        try {
            await lock.unlock;
            return true
        } catch (e) {
            console.error(`Error while releasing lock for ${lock.resource}`);
            return false;
        }
    }

}