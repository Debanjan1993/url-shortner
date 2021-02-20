import bcrypt from 'bcrypt';

export default class Crypto {
    saltRounds = 10;

    constructor() { }

    createCrypt = async (password: string) => {
        const salt = await bcrypt.genSalt(this.saltRounds);
        const hashpassword = await bcrypt.hash(password, salt);
        return hashpassword;
    }

    comparePassword = async (userPassword: string, hashPassword: string) => {

        const match = await bcrypt.compare(userPassword, hashPassword);
        return match;
    }

}

