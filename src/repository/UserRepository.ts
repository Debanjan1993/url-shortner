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

}