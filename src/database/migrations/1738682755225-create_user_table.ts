import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from 'typeorm';
const { Table } = pkg;

export class CreateUsersTable1738682755225 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'uuid', type: 'uuid', isUnique: true },
                { name: 'name', type: 'varchar', isNullable: false },
                { name: 'email', type: 'varchar', isNullable: false, isUnique: true },
                { name: 'phoneNumber', type: 'varchar', isNullable: true },
                { name: 'profilePicture', type: 'varchar', isNullable: true },
                { 
                    name: 'status', 
                    type: 'enum', 
                    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], 
                    default: "'ACTIVE'" 
                },
                { name: 'preferredLanguage', type: 'varchar', default: "'en'" },
                { name: 'timezone', type: 'varchar', isNullable: true },
                { name: 'metadata', type: 'jsonb', isNullable: true },
                { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }
}