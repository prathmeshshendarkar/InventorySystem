import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  // 1. Create PostgreSQL enum type
  pgm.createType("order_status", [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]);

  // 2. Remove the existing VARCHAR default
  pgm.alterColumn("orders", "status", {
    default: null,
  });

  // 3. Change VARCHAR -> ENUM
  pgm.alterColumn("orders", "status", {
    type: "order_status",
    using: "status::order_status",
  });

  // 4. Restore the default using the enum type
  pgm.alterColumn("orders", "status", {
    default: "PENDING",
  });
};

export const down = (pgm: MigrationBuilder): void => {
  // 1. Remove enum default
  pgm.alterColumn("orders", "status", {
    default: null,
  });

  // 2. Convert ENUM back to VARCHAR
  pgm.alterColumn("orders", "status", {
    type: "varchar(30)",
    using: "status::text",
  });

  // 3. Restore VARCHAR default
  pgm.alterColumn("orders", "status", {
    default: "PENDING",
  });

  // 4. Remove PostgreSQL enum type
  pgm.dropType("order_status");
};