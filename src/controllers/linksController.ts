import express from 'express';
import validUrl from 'valid-url';
import { nanoid } from 'nanoid';
import config from 'config';
import { Links } from '../entity/Links/Links';
import moment from 'moment';
import { LinkRepository } from '../repository/LinkRepository'
import { Connection, getConnection } from 'typeorm';
import { UserRepository } from '../repository/UserRepository';
import JobLogger from '../Logger';

class LinksController {
    connection: Connection;
    jobLogger: JobLogger;
    constructor() {
        this.connection = getConnection();
        this.jobLogger = new JobLogger('Links Controller');
    }

    createLinks = async (req: express.Request, res: express.Response) => {

        this.jobLogger.info(`Received request`);
        const { longUrl } = req.body;
        const baseUrl = config.get<string>('baseUrl');

        if (!validUrl.isUri(baseUrl)) {
            return res.status(401).json('Invalid base url');
        }

        if (!longUrl || !validUrl.isUri(longUrl)) {
            return res.status(401).json('Please enter a valid long URI');
        }

        try {
            const linkRepository = this.connection.getCustomRepository(LinkRepository);

            const urlCode = await this.generateURLCode(linkRepository);

            const userRepository = this.connection.getCustomRepository(UserRepository);
            const user = await userRepository.getUserByEmail(req.session.email);

            const newLinkObj = new Links();
            newLinkObj.code = urlCode;
            newLinkObj.date = moment().format("DD-MM-YYYY");
            newLinkObj.longUrl = longUrl;
            newLinkObj.shortUrl = `${baseUrl}${urlCode}`;
            newLinkObj.userId = user.id;

            await linkRepository.save(newLinkObj);

            return res.json({
                shortURL: newLinkObj.shortUrl
            });

        } catch (e) {
            this.jobLogger.error(`Exception while performing db operations ${e.message}`, e)
            return res.status(500).json('Interval Server Error');
        }

    }

    getOriginalLink = async (req: express.Request, res: express.Response) => {

        const code = req.params.code;

        try {
            const linkRepository = this.connection.getCustomRepository(LinkRepository);
            const originalLink = await linkRepository.getLongUrlByCode(code);

            if (!originalLink) {
                return res.status(404).json('URL not found');
            }

            res.redirect(originalLink.longUrl);

        } catch (e) {
            this.jobLogger.error(`Exception while performing db operations ${e.message}`, e)
            return res.status(500).json('Interval Server Error');
        }

    }

    private generateURLCode = async (linkRepository: LinkRepository): Promise<string> => {
        const urlCode = nanoid(7);
        const url = await linkRepository.getLongUrlByCode(urlCode);
        if (url) {
            return await this.generateURLCode(linkRepository);
        } else {
            return urlCode;
        }
    }

    deleteLink = async (req: express.Request, res: express.Response) => {
        try {
            const email = req.session.email;
            const { link } = req.body;

            const userRepository = this.connection.getCustomRepository(UserRepository);
            const linkRepository = this.connection.getCustomRepository(LinkRepository);

            const user = await userRepository.getUserByEmail(email);
            await linkRepository.deleteLinkByUser(user, link);

            res.status(200).json('Link deleted');

        } catch (e) {
            this.jobLogger.error(`Exception while deleting link from DB ${e.message}`, e);
            return res.status(500).json('Internal Server Error');
        }
    }

}

export default LinksController;

