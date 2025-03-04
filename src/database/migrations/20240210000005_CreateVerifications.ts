import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from 'typeorm';
const { Table, TableForeignKey } = pkg;

export class CreateVerifications20240210000005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "verifications",
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: "auth_user_id", type: "varchar", isUnique: true },
                { name: "user_type", type: "enum", enum: ["Business", "Rider", "Customer"], isNullable: false },
                { name: "document_type", type: "enum", enum: ["International Passport", "Resident Permit", "Driver’s License", "Student ID", "Passport"], isNullable: false },
                { name: "document_url", type: "varchar", isNullable: false },
                { name: "status", type: "enum", enum: ["Pending", "Approved", "Rejected"], default: "'Pending'" },
                { name: "verification_data", type: "json", isNullable: true },
                { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }
            ],
            foreignKeys: [
                {
                    columnNames: ["auth_user_id"],
                    referencedTableName: "user_profiles",
                    referencedColumnNames: ["auth_user_id"],
                    onDelete: "CASCADE"
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("verifications");
    }
}