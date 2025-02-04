import type { MigrationInterface, QueryRunner } from "typeorm";
import pkg from "typeorm";
const { Table, TableForeignKey } = pkg;

export class CreateRiderProfileTable1738682787144
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "rider_profiles",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "dateOfBirth", type: "timestamp", isNullable: false },
          { name: "gender", type: "varchar", isNullable: true },
          {
            name: "vehicleType",
            type: "enum",
            enum: ["BICYCLE", "MOTORCYCLE", "CAR", "VAN"],
            isNullable: false,
          },
          { name: "vehicleInfo", type: "jsonb", isNullable: true },
          { name: "deliveryPreferences", type: "jsonb", isNullable: true },
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
      "rider_profiles",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("rider_profiles");
  }
}
