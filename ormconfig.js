import config from 'config';

const ormconfig = {
    "type": "postgres",
    "host": config.get('host'),
    "port": config.get('port'),
    "username": config.get('user'),
    "password": config.get('password'),
    "database": config.get('db'),
    "synchronize": true,
    "logging": false,
    "dropSchema": false,
    "entities": [
        "./src/entity/**/*.ts"
    ],
    "migrations": [
        "src/migration/**/*.ts"
    ],
    "subscribers": [
        "src/subscriber/**/*.ts"
    ],
    "cli": {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
    }
}

export default ormconfig;