import express, { Router } from 'express';
import LinksController from '../controllers/linksController';
import path from 'path';
import UsersController from '../controllers/userController';


class Route {
   router: Router
   linksController: LinksController
   usersController: UsersController
   constructor() {
      this.router = express.Router();
      this.linksController = new LinksController();
      this.usersController = new UsersController();
   }

   init(app: express.Application) {

      this.router.get('/signup', (req, res) => {
         res.sendFile(path.join(__dirname + '../../../public/' + 'register.html'));
      });

      this.router.get('/login', (req, res) => {
         res.sendFile(path.join(__dirname + '../../../public/' + 'login.html'));
      })

      this.router.get('/dashboard', (req, res) => {
         res.sendFile(path.join(__dirname + '../../../public/' + 'dashboard.html'));
      })

      this.router.post('/api/signup', async (req, res) => {
         await this.usersController.addUser(req, res);
      })

      this.router.post('/api/login', async (req, res) => {
         await this.usersController.verifyUser(req, res);
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