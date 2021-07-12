import express from 'express';
import { Connection, getConnection } from 'typeorm';
import { Users } from '../entity/Users/Users';
import { UserRepository } from '../repository/UserRepository';
import { LinkRepository } from '../repository/LinkRepository'
import moment from 'moment';
import Crypto from '../crypto/crypto';
import jwt from 'jsonwebtoken';
import config from 'config';
import CryptoJS from 'crypto-js';
import publishToQueue from '../queueService/publish';
import { ConfirmationEmail } from '../customTypesDec/interfaceDec';
import JobLogger from '../Logger';

export default class UsersController {
    connection: Connection;
    crypto: Crypto;
    routingRoute = 'db_confirmation_mail_test_queue';
    jobLogger: JobLogger;
    constructor() {
        this.connection = getConnection();
        this.crypto = new Crypto();
        this.jobLogger = new JobLogger('User Controller');
    }

    addUser = async (req: express.Request, res: express.Response) => {
        try {
            const { personName, email, password, password2 } = req.body;

            if (!personName) {
                return res.status(400).json('Please enter the name');
            }
            if (!email) {
                return res.status(400).json('Please enter the email');
            }
            if (!password) {
                return res.status(400).json('Please enter the password');
            }
            if (!password2) {
                return res.status(400).json('Please confirm the password by entering again');
            }

            if (password !== password2) {
                return res.status(400).json('The password entered do not match with each other');
            }

            const userRepository = this.connection.getCustomRepository(UserRepository);
            const userExist = await userRepository.getUserByEmail(email);

            if (userExist) {
                return res.status(400).json('User with this email already exists');
            }

            const hashedPassword = await this.crypto.createCrypt(password);
            const hashedEmail = await this.crypto.createCrypt(email);

            const user = new Users();

            user.username = personName;
            user.email = email;
            user.password = hashedPassword;
            user.dateOfJoining = moment().unix();
            user.isVerified = false;

            await userRepository.save(user);

            const encryptedEmail = await this.encryptEmail(user.email);
            this.jobLogger.info(`Publishing message to confirmation email queue for email ${user.email}`);

            const emailObj: ConfirmationEmail = {
                email: user.email,
                code: encodeURIComponent(encryptedEmail)
            }

            const isSent = publishToQueue(this.routingRoute, Buffer.from(JSON.stringify(emailObj)));
            if (!isSent) {
                this.jobLogger.error(`Unable to put user ${emailObj.email} in the confirmation email queue`);
            }
            return res.status(201).json('User created');
        } catch (err) {
            this.jobLogger.error(`Exception : ${err}`);
            return res.status(500).json('Internal Server Error');
        }

    }

    verifyUser = async (req: express.Request, res: express.Response) => {
        try {
            const { username, password } = req.body;
            if (!username) {
                return res.status(400).json('Please enter the username');
            }
            if (!password) {
                return res.status(400).json('Please enter the password');
            }

            const userRepository = this.connection.getCustomRepository(UserRepository);
            const user = await userRepository.getUserByEmail(username);

            if (!user) {
                return res.status(400).json('No user exists with the entered email please sign up now');
            }

            if (!user.isVerified) {
                return res.status(403).json('Confirmation mail has been sent to your email. Please click on the link given on the email to verify your account.')
            }

            const dbpassword = user.password;

            const isMatched = await this.crypto.comparePassword(password, dbpassword);

            if (!isMatched) {
                return res.status(401).json('The password entered is not correct');
            }

            const jwtbody = {
                username,
                password
            }
            const privateKey = config.get<string>('privateKey')

            jwt.sign({ jwtbody: jwtbody }, privateKey, (err: any, token: any) => {
                if (err) {
                    this.jobLogger.error(`Unable to generate token ${err}`)
                    return res.status(500).json('Internal Server Error');
                }
                else {
                    req.session.email = username;
                    return res.status(200).json(token);
                }
            })
        } catch (err) {
            this.jobLogger.error(`Exception : ${err}`);
            return res.status(500).json('Internal Server Error');
        }
    }

    logoutUser = async (req: express.Request, res: express.Response) => {
        req.session.destroy(err => {
            if (err) {
                this.jobLogger.error(`Error logging out ${err}`);
                return res.status(500).json('Internal Server Error');
            } else {
                return res.status(200).json(`Logged out successfully`);
            }
        });
    }

    getUserDetails = async (req: express.Request, res: express.Response) => {
        try {
            const email = req.session.email;
            const userRepository = this.connection.getCustomRepository(UserRepository);
            const linksRepository = this.connection.getCustomRepository(LinkRepository);

            const user = await userRepository.getUserByEmail(email);
            const userlinks = await linksRepository.getLinksByUser(user as Users);

            const obj = {
                links: userlinks[0],
                count: userlinks[1],
                username: user.username,
                email: user.email
            }

            return res.status(200).json(obj);
        } catch (err) {
            this.jobLogger.error(`Exception : ${err}`);
            return res.status(500).json('Internal Server Error');
        }

    }

    updateUserInfo = async (req: express.Request, res: express.Response) => {
        try {
            const originalEmail = req.session.email;

            const { name, email, password, password2 } = req.body;

            if (!name) {
                return res.status(400).json('Please enter the name');
            }
            if (!email) {
                return res.status(400).json('Please enter the email');
            }
            if (!password) {
                return res.status(400).json('Please enter the password');
            }
            if (!password2) {
                return res.status(400).json('Please confirm the password by entering again');
            }

            if (password !== password2) {
                return res.status(400).json('The password entered do not match with each other');
            }

            const userRepository = this.connection.getCustomRepository(UserRepository);

            if (originalEmail !== email) {
                const userExist = await userRepository.getUserByEmail(email);
                if (userExist) {
                    return res.status(400).json('User with this email already exists');
                }
            }

            const hashedPassword = await this.crypto.createCrypt(password);

            const user: Partial<Users> = {
                username: name,
                email: email,
                password: hashedPassword
            }

            await userRepository.updateUserInfo(originalEmail, user);

            return res.status(200).json('User Info Updated');
        } catch (err) {
            this.jobLogger.error(`Exception : ${err}`);
            return res.status(500).json('Internal Server Error');
        }
    }

    getUserConfirmation = async (req: express.Request, res: express.Response) => {
        try {
            const code = decodeURIComponent(req.params.code);
            const email = await this.decryptEmail(code);

            const userRepository = this.connection.getCustomRepository(UserRepository);

            const user = await userRepository.getUserByEmail(email);
            user.isVerified = true;

            await userRepository.updateUserStatus(user);

            res.redirect('/login');
        } catch (err) {
            this.jobLogger.error(`Exception : ${err}`);
            return res.status(500).json('Internal Server Error');
        }

    }

    encryptEmail = async (email: string) => {
        const cipherText = CryptoJS.AES.encrypt(email, config.get<string>("encryptionKey")).toString();
        return cipherText;
    }

    decryptEmail = async (code: string) => {
        const bytes = CryptoJS.AES.decrypt(code, config.get<string>("encryptionKey"));
        const email = bytes.toString(CryptoJS.enc.Utf8);
        return email;
    }

}