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

      this.router.get('/dashboard', this.middleware.verifyToken, this.middleware.verifyRoute, (req, res) => {
         res.sendFile(path.join(__dirname + '../../../public/' + 'dashboard.html'));
      })

      this.router.get('/account', this.middleware.verifyToken, this.middleware.verifyRoute, (req, res) => {
         res.sendFile(path.join(__dirname + '../../../public/' + 'account.html'));
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

      this.router.get('/api/userDetails', this.middleware.verifyToken, this.middleware.verifyRoute, async (req, res) => {
         await this.usersController.getUserDetails(req, res);
      })

      this.router.post('/api/updateInfo', this.middleware.verifyToken, this.middleware.verifyRoute, async (req, res) => {
         await this.usersController.updateUserInfo(req, res);
      })

      this.router.get('/test', (req, res) => {
         res.status(200).json('test successful');
      })

      this.router.get('/:code', async (req, res) => {
         await this.linksController.getOriginalLink(req, res);
      })

      this.router.post('/shorten', this.middleware.verifyToken, this.middleware.verifyRoute, async (req, res) => {
         await this.linksController.createLinks(req, res);
      })

      this.router.post('/api/deleteLink', this.middleware.verifyToken, this.middleware.verifyRoute, async (req, res) => {
         await this.linksController.deleteLink(req, res);
      })

      this.router.get('/confirmation/:code', async (req, res) => {
         await this.usersController.getUserConfirmation(req, res);
      })

      app.use('/', this.router);
   }

}

export default Route;