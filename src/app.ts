import "reflect-metadata";
import express from 'express';
import bodyParser from 'body-parser';
import Route from './routes/route'
import connectToDb from './postgresConnection';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import config from 'config';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';
import { connectToQueueServer } from './queueService/queueConnection';
import logger from 'pino';


(async function () {

    try {

        const app = express();
        const port = process.env.PORT || 3500;

        const pgPool = new pg.Pool({
            host: config.get<string>("host"),
            user: config.get<string>("user"),
            password: config.get<string>("password"),
            port: config.get<number>("port"),
            database: config.get<string>("db")
        })
        const pgStore = connectPgSimple(session);

        app.use(cookieParser())
        app.use(bodyParser.json());
        app.use(express.static(path.join(__dirname + '../../public/')));
        app.use(session({
            store: new pgStore({
                pool: pgPool
            }),
            secret: config.get<string>("sessionKey"),
            resave: false,
            saveUninitialized: false,
        }));

        await connectToQueueServer();
        await connectToDb();
        const route = new Route();
        route.init(app);

        app.listen(port, () => logger().info(`App running on PORT : ${port}`));
    } catch (err) {
        logger().error(`Exception : ${err}`);
    }

})();