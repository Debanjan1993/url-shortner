import {MigrationInterface, QueryRunner} from "typeorm";

export class test1618266932050 implements MigrationInterface {
    name = 'test1618266932050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "test" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "test"`);
    }

}
