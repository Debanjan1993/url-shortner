import { createConnection, Connection } from 'typeorm';
import config from 'config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import logger from 'pino';


async function connectToDb() {

    const connectionOptions: PostgresConnectionOptions = {
        type: "postgres",
        host: config.get<string>('host'),
        port: config.get<number>('port'),
        username: config.get<string>('user'),
        password: config.get<string>('password'),
        database: config.get<string>('db'),
        synchronize: true,
        logging: false,
        dropSchema: false,
        entities: [
            "./dist/entity/**/*.js"
        ]
    };

    const connection = createConnection(connectionOptions).then(x => logger().info(`Connected to DB successfully`));

}

export default connectToDb;