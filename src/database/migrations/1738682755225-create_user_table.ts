import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from 'typeorm';
const { Table } = pkg;

export class CreateUsersTable20240207000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                },
                {
                    name: 'authId',
                    type: 'varchar',
                    isNullable: true,
                    isUnique: true
                },
                {
                    name: 'bio',
                    type: 'jsonb',
                    isNullable: false,
                    default: `'${JSON.stringify({
                        username: '',
                        email: '',
                        name: {
                            first: '',
                            last: '',
                            full: ''
                        },
                        photo: null,
                        phone: null
                    })}'::jsonb`
                },
                {
                    name: 'dates',
                    type: 'jsonb',
                    isNullable: false,
                    default: `'${JSON.stringify({
                        createdAt: Date.now(),
                        deletedAt: null
                    })}'::jsonb`
                },
                {
                    name: 'status',
                    type: 'jsonb',
                    isNullable: false,
                    default: `'${JSON.stringify({
                        connections: [],
                        lastUpdatedAt: Date.now()
                    })}'::jsonb`
                },
                {
                    name: 'account',
                    type: 'jsonb',
                    isNullable: false,
                    default: `'${JSON.stringify({
                        rankings: {
                            daily: { value: 0, lastUpdatedAt: Date.now() },
                            weekly: { value: 0, lastUpdatedAt: Date.now() },
                            monthly: { value: 0, lastUpdatedAt: Date.now() },
                            overall: { value: 0, lastUpdatedAt: Date.now() }
                        },
                        meta: {},
                        ratings: {
                            total: 0,
                            count: 0,
                            average: 0
                        },
                        application: null,
                        trips: {},
                        location: null,
                        savedLocations: [],
                        settings: {
                            notifications: true,
                            driverAvailable: false
                        }
                    })}'::jsonb`
                },
                {
                    name: 'typeData',
                    type: 'jsonb',
                    isNullable: true
                },
                {
                    name: 'vendorData',
                    type: 'jsonb',
                    isNullable: true
                }
            ]
        }));

        // Create indices for efficient querying
        await queryRunner.query(`
            CREATE INDEX idx_user_bio_username ON users ((bio->>'username'));
            CREATE INDEX idx_user_type ON users ((typeData->>'type'));
            CREATE INDEX idx_user_auth_id ON users (("authId"));
        `);

        // Create unique constraints
        await queryRunner.query(`
            ALTER TABLE users 
            ADD CONSTRAINT unique_user_email 
            UNIQUE ((bio->>'email'));

            ALTER TABLE users 
            ADD CONSTRAINT unique_user_username 
            UNIQUE ((bio->>'username'));
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indices first
        await queryRunner.query(`
            DROP INDEX IF EXISTS idx_user_bio_username;
            DROP INDEX IF EXISTS idx_user_type;
            DROP INDEX IF EXISTS idx_user_auth_id;
        `);

        // Drop the table
        await queryRunner.dropTable('users');
    }
}