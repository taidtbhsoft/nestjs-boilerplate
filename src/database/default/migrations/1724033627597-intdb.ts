import {MigrationInterface, QueryRunner} from 'typeorm';

export class Intdb1724033627597 implements MigrationInterface {
  name = 'Intdb1724033627597';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TYPE "public"."users_role_enum" AS ENUM(\'USER\', \'ADMIN\')'
    );
    await queryRunner.query(
      'CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying, "lastName" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT \'USER\', "email" character varying, "password" character varying, "phone" character varying, "avatar" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TYPE "public"."users_role_enum"');
  }
}
