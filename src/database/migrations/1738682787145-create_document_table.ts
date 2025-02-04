import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from "typeorm";
const { Table, TableForeignKey } = pkg;

export class CreateDocumentTable1738682787145 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "documents",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "type",
            type: "enum",
            enum: [
              "IDENTITY",
              "BUSINESS_LICENSE",
              "VEHICLE_REGISTRATION",
              "INSURANCE",
              "OTHER",
            ],
            isNullable: false,
          },
          { name: "url", type: "varchar", isNullable: false },
          { name: "mimeType", type: "varchar", isNullable: false },
          {
            name: "status",
            type: "enum",
            enum: ["PENDING", "APPROVED", "REJECTED"],
            default: "'PENDING'",
          },
          { name: "metadata", type: "jsonb", isNullable: true },
          { name: "userId", type: "int", isNullable: false },
          { name: "verificationStatusId", type: "int", isNullable: true },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );

    // Add foreign keys
    await queryRunner.createForeignKeys("documents", [
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["verificationStatusId"],
        referencedColumnNames: ["id"],
        referencedTableName: "verification_statuses",
        onDelete: "SET NULL",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("documents");
  }
}
