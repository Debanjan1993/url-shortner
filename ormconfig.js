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
        "./dist/entity/**/*.js"
    ],
    "migrations": [
        "dist/migration/**/*.js"
    ],
    "subscribers": [
        "dist/subscriber/**/*.js"
    ],
    "cli": {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
    }
}

export default ormconfig;