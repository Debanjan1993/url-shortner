import express from 'express';

class Middlewares {
    constructor(){}

    verifyToken(req:express.Request,res:express.Response,next:express.NextFunction){
        const authCookie = req.cookies['authorization'];
        if(authCookie){
            const token = authCookie.split(" ")[1];
            req.token = token;
            next();
        }else{
            return res.status(401).json('Session expired please sign in again');
        }
    }
}

export default Middlewares;