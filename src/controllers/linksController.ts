import express from 'express';
import validUrl from 'valid-url';
import shortid from 'shortid';
import config from 'config';
import connection from '../postgresConnection';
import { Links } from '../entity/Links/Links';
import { url } from 'inspector';
import moment from 'moment';
import { LinkRepository } from '../repository/LinkRepository'
import { Connection, getConnection } from 'typeorm';

class LinksController {
    connection: Connection;
    constructor() {
        this.connection = getConnection();
    }

    createLinks = async (req: express.Request, res: express.Response) => {

        console.log(`Received request`);
        const { longUrl } = req.body;
        const baseUrl = config.get<string>('baseUrl');

        if (!validUrl.isUri(baseUrl)) {
            return res.sendStatus(401).json('Invalid base url');
        }

        if (!longUrl || !validUrl.isUri(longUrl)) {
            return res.sendStatus(401).json('Please enter a valid long URI');
        }


        try {
            const linkRepository = this.connection.getCustomRepository(LinkRepository);

            const link = await linkRepository.getLinkByLongUrl(longUrl);

            if (link && link.shortUrl) {
                return res.json({
                    shortURL: link.shortUrl
                })
            }

            const urlCode = shortid.generate();

            const newLinkObj = new Links();
            newLinkObj.code = urlCode;
            newLinkObj.date = moment().unix();
            newLinkObj.longUrl = longUrl;
            newLinkObj.shortUrl = `${baseUrl}${urlCode}`

            await linkRepository.save(newLinkObj);

            return res.json({
                shortURL: newLinkObj.shortUrl
            });

        } catch (e) {
            console.error(`Exception while performing db operations ${e.message}`)
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
            console.error(`Exception while performing db operations ${e.message}`)
            return res.status(500).json('Interval Server Error');
        }

    }

}

export default LinksController;

