import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSuperAdminRole1777815523639 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "users_role_enum" ADD VALUE 'super_admin'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // PostgreSQL doesn't support removing values from an enum easily.
        // Usually, you'd have to drop the type and recreate it, but that's risky.
        // For this case, we'll leave it as is or do nothing in down.
    }

}
