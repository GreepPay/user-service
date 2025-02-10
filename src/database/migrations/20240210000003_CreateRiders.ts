import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from 'typeorm';
const { Table, TableForeignKey } = pkg;

export class CreateRiders20240210000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "riders",
            columns: [
                { name: "id", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                { name: "user_profile_id", type: "uuid", isUnique: true },
                { name: "location", type: "varchar", isNullable: true },
                { name: "license", type: "varchar", isNullable: false },
                { name: "vehicle_type", type: "varchar", isNullable: false },
                { name: "vehicle_registration_number", type: "varchar", isNullable: false },
                { name: "vehicle_insurance", type: "varchar", isNullable: true },
                { name: "experience_years", type: "varchar", isNullable: true },
                { name: "availability_status", type: "varchar", isNullable: false, default: "true" },
                { name: "notification_preferences", type: "varchar", isNullable: false, default: "true" },
                { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }
            ]
        }));

        await queryRunner.createForeignKey("riders", new TableForeignKey({
            columnNames: ["user_profile_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "user_profiles",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("riders");
    }
}