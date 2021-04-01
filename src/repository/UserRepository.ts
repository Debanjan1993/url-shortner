import { EntityRepository, Repository } from "typeorm";
import { Users } from "../entity/Users/Users";

@EntityRepository(Users)
export class UserRepository extends Repository<Users>{

    async getUserByEmail(email: string) {
        return this.findOne({
            where: {
                email: email
            }
        })
    }

    async getFreeUsers(skip: number, take: number) {
        return this.find({
            where: {
                isPaidUser: false
            },
            skip: skip,
            take: take
        })
    }

    async getFreeUserCount() {
        return this.count({
            where: {
                isPaidUser: false
            }
        })
    }

    async updateUserStatus(user: Users) {
        return await this.update({
            id: user.id,
            email: user.email
        }, {
            isVerified: user.isVerified
        })
    }

    async updateUserInfo(originalEmail: string, user: Partial<Users>) {
        return await this.update({
            email: originalEmail
        }, {
            username: user.username,
            email: user.email,
            password: user.password,
        })
    }

}