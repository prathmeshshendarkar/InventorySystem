import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.createTable("order_projections", {
    id: {
      type: "uuid",
      primaryKey: true,
      notNull: true,
      default: pgm.func("gen_random_uuid()"),
    },

    order_id: {
      type: "uuid",
      notNull: true,
      unique: true,
    },

    customer_id: {
      type: "uuid",
      notNull: true,
    },

    total_amount: {
      type: "numeric(12,2)",
      notNull: true,
    },

    status: {
      type: "varchar(20)",
      notNull: true,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.dropTable("order_projections");
};