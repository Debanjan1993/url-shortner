import {MigrationInterface, QueryRunner} from "typeorm";

export class urlshortner1625932756274 implements MigrationInterface {
    name = 'urlshortner1625932756274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "dateOfJoining" integer NOT NULL, "isPaidUser" boolean NOT NULL, "isVerified" boolean NOT NULL, "test" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "links" ("id" SERIAL NOT NULL, "longUrl" character varying NOT NULL, "shortUrl" character varying NOT NULL, "code" character varying NOT NULL, "date" character varying NOT NULL, "isDisabled" boolean DEFAULT false, "userId" integer NOT NULL, CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_52a3fa2a2c27a987ed58fd2ea4" ON "links" ("code") `);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "FK_56668229b541edc1d0e291b4c3b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_56668229b541edc1d0e291b4c3b"`);
        await queryRunner.query(`DROP INDEX "IDX_52a3fa2a2c27a987ed58fd2ea4"`);
        await queryRunner.query(`DROP TABLE "links"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
