import express, { Router } from 'express';
import LinksController from '../controllers/linksController';
import path from 'path';
import UsersController from '../controllers/userController';
import Middlewares from './middleware';
import jwt from 'jsonwebtoken';
import config from 'config';



class Route {
   router: Router
   linksController: LinksController
   usersController: UsersController
   middleware: Middlewares
   constructor() {
      this.router = express.Router();
      this.linksController = new LinksController();
      this.usersController = new UsersController();
      this.middleware = new Middlewares();
   }

   init(app: express.Application) {

      this.router.get('/signup', (req, res) => {
         res.sendFile(path.join(__dirname + '../../../public/' + 'register.html'));
      });

      this.router.get('/login', (req, res) => {
         res.sendFile(path.join(__dirname + '../../../public/' + 'login.html'));
      })

      this.router.get('/dashboard', this.middleware.verifyToken, (req, res) => {
         jwt.verify(req.token as string, config.get('privateKey'), (err, decoded) => {
            if (err) {
               return res.status(401).json('Authentication failed please sign in again');
            } else {
               return res.sendFile(path.join(__dirname + '../../../public/' + 'dashboard.html'));
            }
         });

      })

      this.router.post('/api/signup', async (req, res) => {
         await this.usersController.addUser(req, res);
      })

      this.router.post('/api/login', async (req, res) => {
         await this.usersController.verifyUser(req, res);
      })

      this.router.post('/api/logout', async (req, res) => {
         await this.usersController.logoutUser(req, res);
      })

      this.router.get('/test', (req, res) => {
         res.status(200).json('test successful');
      })

      this.router.get('/:code', async (req, res) => {
         await this.linksController.getOriginalLink(req, res);
      })

      this.router.post('/shorten', async (req, res) => {
         await this.linksController.createLinks(req, res);
      })

      app.use('/', this.router);
   }

}

export default Route;