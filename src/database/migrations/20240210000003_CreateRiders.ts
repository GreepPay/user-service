import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from 'typeorm';
const { Table, TableForeignKey } = pkg;

export class CreateRiders20240210000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "riders",
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: "auth_user_id", type: "varchar", isUnique: true },
                { name: "location", type: "varchar", isNullable: true },
                { name: "license", type: "varchar", isNullable: true },
                { name: "vehicle_type", type: "varchar", isNullable: true },
                { name: "vehicle_registration_number", type: "varchar", isNullable: true },
                { name: "vehicle_insurance", type: "varchar", isNullable: true },
                { name: "experience_years", type: "varchar", isNullable: true },
                { name: "availability_status", type: "varchar", isNullable: false, default: "true" },
                { name: "notification_preferences", type: "varchar", isNullable: false, default: "true" },
                { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }
            ]
        }));

        await queryRunner.createForeignKey("riders", new TableForeignKey({
            columnNames: ["auth_user_id"],
            referencedColumnNames: ["auth_user_id"],
            referencedTableName: "user_profiles",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("riders");
    }
}