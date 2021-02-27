import express from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import path from 'path';

class Middlewares {
    constructor() { }

    verifyToken(req: express.Request, res: express.Response, next: express.NextFunction) {
        const authCookie = req.cookies['authorization'];
        if (authCookie) {
            const token = authCookie.split(" ")[1];
            req.token = token;
            next();
        } else {
            return res.status(401).json('Session expired please sign in again');
        }
    }

    verifyRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
        jwt.verify(req.token as string, config.get('privateKey'), (err, decoded) => {
            if (err) {
                return res.status(401).json('Authentication failed please sign in again');
            } else {
                next();
            }
        });
    }

}

export default Middlewares;