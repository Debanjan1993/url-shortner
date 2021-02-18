import "reflect-metadata";
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/route'

const app = express();
const port = process.env.PORT || 3500;


app.use(bodyParser.json());

app.use('/',routes);

app.use(bodyParser.json());


app.listen(port, ()=> console.log(`App running on PORT : ${port}`));