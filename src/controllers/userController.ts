import express from 'express';
import { Connection, getConnection } from 'typeorm';
import { Users } from '../entity/Users/Users';
import { UserRepository } from '../repository/UserRepository';
import moment from 'moment';
import Crypto from '../crypto/crypto';
import jwt from 'jsonwebtoken';
import config from 'config';

export default class UsersController {
    connection: Connection;
    crypto: Crypto;
    constructor() {
        this.connection = getConnection();
        this.crypto = new Crypto();
    }

    addUser = async (req: express.Request, res: express.Response) => {

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

        const user = new Users();

        user.username = personName;
        user.email = email;
        user.password = hashedPassword;
        user.dateOfJoining = moment().unix();

        await userRepository.save(user);

        return res.status(201).json('User created');

    }

    verifyUser = async (req: express.Request, res: express.Response) => {
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
                console.log(`Unable to generate token ${err}`)
                return res.status(500).json('Internal Server Error');
            }
            else {
                return res.status(200).json(token);
            }
        })

    }

}