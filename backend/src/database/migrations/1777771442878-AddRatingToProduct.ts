import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRatingToProduct1777771442878 implements MigrationInterface {
    name = 'AddRatingToProduct1777771442878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "rating" double precision NOT NULL DEFAULT '5'`);
        await queryRunner.query(`ALTER TABLE "products" ADD "reviews_count" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "reviews_count"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "rating"`);
    }

}
