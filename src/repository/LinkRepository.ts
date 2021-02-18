import { EntityRepository,Repository } from "typeorm";
import { Links } from "../entity/Links/Links";

@EntityRepository(Links)
export class LinkRepository extends Repository<Links>{

    async getLinkByLongUrl(longUrl:string){
        return this.findOne({
            where: {
                longUrl: longUrl
            }
        })
    }

    async getLongUrlByCode(code:string){
        return this.findOne({
            where : {
                code : code
            }
        })
    }

}