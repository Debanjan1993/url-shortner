import express, { Router } from 'express';
import LinksController from '../controllers/linksController'


class Route {
   router: Router
   linksController: LinksController
   constructor() {
      this.router = express.Router();
      this.linksController = new LinksController();
   }

   init(app: express.Application) {
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