import express from 'express';
import {createLinks,getOriginalLink} from '../controllers/linksController'

const router = express.Router();

router.get('/test',(req,res)=>{
    res.status(200).json('test successful');
})

router.get('/:code',async(req,res)=>{
   await getOriginalLink(req,res);
})

router.post('/shorten', async (req,res)=>{
   await createLinks(req,res);
})

export default router;