import { createConnection, Connection } from 'typeorm';
import config from 'config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';



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
        "./src/entity/**/*.ts"
    ]
};

const connection = createConnection(connectionOptions);

export default connection;


