import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from 'typeorm';
const { Table, TableForeignKey } = pkg;

export class CreateCustomers20240210000004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "customers",
            columns: [
                { name: "id", type: "uuid", isPrimary: true, default: "uuid_generate_v4()" },
                { name: "user_profile_id", type: "uuid", isUnique: true },
                { name: "location", type: "varchar", isNullable: true },
                { name: "resident_permit", type: "varchar", isNullable: true },
                { name: "passport", type: "varchar", isNullable: true },
                { name: "student_id", type: "varchar", isNullable: true },
                { name: "notification_preferences", type: "varchar", isNullable: false, default: "true" },
                { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }
            ]
        }));

        await queryRunner.createForeignKey("customers", new TableForeignKey({
            columnNames: ["user_profile_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "user_profiles",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("customers");
    }
}