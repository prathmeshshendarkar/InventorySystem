import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
    pgm.createExtension("pgcrypto", {
        ifNotExists: true,
    });
  pgm.createTable("orders", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    user_id: {
      type: "uuid",
      notNull: true,
    },

    status: {
      type: "varchar(30)",
      notNull: true,
      default: "PENDING",
    },

    total_amount: {
      type: "numeric(12,2)",
      notNull: true,
    },

    currency: {
      type: "varchar(3)",
      notNull: true,
      default: "INR",
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.addConstraint("orders", "orders_total_amount_check", {
    check: "total_amount >= 0",
  });

  pgm.addConstraint("orders", "orders_currency_check", {
    check: "length(currency) = 3",
  });

  pgm.createIndex("orders", "user_id");
  pgm.createIndex("orders", "status");
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.dropTable("orders");
};