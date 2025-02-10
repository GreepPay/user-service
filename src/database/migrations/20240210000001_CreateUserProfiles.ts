import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from 'typeorm';
const { Table } = pkg;

export class CreateUserProfiles20240210000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "user_profiles",
            columns: [
                { name: "id", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                { name: "auth_user_id", type: "varchar", isUnique: true },
                { name: "user_type", type: "enum", enum: ["Business", "Rider", "Customer"], isNullable: false },
                { name: "profile_picture", type: "varchar", isNullable: true },
                { name: "verification_status", type: "enum", enum: ["Pending", "Approved", "Rejected"], default: "'Pending'" },
                { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user_profiles");
    }
}
