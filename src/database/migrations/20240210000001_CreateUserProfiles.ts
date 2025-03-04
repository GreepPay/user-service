import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from "typeorm";
const { Table } = pkg;

export class CreateUserProfiles20240210000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "user_profiles",
            columns: [
                {
                    name: "auth_user_id",
                    type: "varchar",
                    isPrimary: true,
                },
                {
                    name: "user_type",
                    type: "enum",
                    enum: ["Business", "Rider", "Customer"],
                    enumName: "user_type_enum",
                    isNullable: false,
                },
                {
                    name: "profile_picture",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "verification_status",
                    type: "enum",
                    enum: ["Pending", "Approved", "Rejected"],
                    enumName: "verification_status_enum",
                    default: "'Pending'",
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user_profiles");
    }
}
