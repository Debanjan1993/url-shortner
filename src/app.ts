import "reflect-metadata";
import express from 'express';
import bodyParser from 'body-parser';
import Route from './routes/route'
import connectToDb from './postgresConnection';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import config from 'config';

(async function () {

    const app = express();
    const port = process.env.PORT || 3500;

    app.use(cookieParser())
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname + '../../public/')));
    app.use(session({
        secret : config.get<string>("sessionKey"),
        resave : false,
        saveUninitialized : false
    }));

    await connectToDb();
    const route = new Route();
    route.init(app);

    app.listen(port, () => console.log(`App running on PORT : ${port}`));

})();