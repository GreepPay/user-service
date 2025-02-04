import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from 'typeorm';
const { Table, TableForeignKey } = pkg;

export class CreateVerificationTable1738682787142 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'verification_statuses',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'isVerified', type: 'boolean', isNullable: false },
                { name: 'verifiedAt', type: 'timestamp', isNullable: true },
                { name: 'verificationProviderId', type: 'varchar', isNullable: false },
                { name: 'verificationMethod', type: 'varchar', isNullable: false },
                { 
                    name: 'status', 
                    type: 'enum', 
                    enum: ['PENDING', 'VERIFIED', 'REJECTED'], 
                    default: "'PENDING'" 
                },
                { name: 'rejectionReason', type: 'varchar', isNullable: true },
                { name: 'userId', type: 'int', isNullable: false },
                { 
                    name: 'userType', 
                    type: 'enum', 
                    enum: ['business', 'rider'], 
                    isNullable: false 
                },
                { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }
            ]
        }));

        // Add foreign key to users table
        await queryRunner.createForeignKey(
            'verification_statuses',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE'
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('verification_statuses');
    }
}