import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from "typeorm";
const { Table, TableForeignKey } = pkg;

export class CreateBusinessProfileTable1738682787143
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "business_profiles",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "businessName", type: "varchar", isNullable: false },
          {
            name: "businessType",
            type: "enum",
            enum: ["INDIVIDUAL", "COMPANY", "PARTNERSHIP"],
            isNullable: false,
          },
          { name: "registrationNumber", type: "varchar", isNullable: true },
          { name: "taxId", type: "varchar", isNullable: true },
          { name: "businessAddress", type: "jsonb", isNullable: false },
          { name: "businessLogo", type: "varchar", isNullable: true },
          { name: "businessDescription", type: "varchar", isNullable: true },
          { name: "operatingHours", type: "jsonb", isNullable: true },
          { name: "contactPerson", type: "jsonb", isNullable: false },
          { name: "metadata", type: "jsonb", isNullable: true },
          { name: "userId", type: "int", isNullable: false, isUnique: true },
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

    // Add foreign key to users table
    await queryRunner.createForeignKey(
      "business_profiles",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("business_profiles");
  }
}
