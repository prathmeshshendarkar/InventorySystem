import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.createTable("order_items", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    order_id: {
      type: "uuid",
      notNull: true,
      references: "orders(id)",
      onDelete: "CASCADE",
    },

    product_id: {
      type: "uuid",
      notNull: true,
    },

    quantity: {
      type: "integer",
      notNull: true,
    },

    unit_price: {
      type: "numeric(12,2)",
      notNull: true,
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

  pgm.addConstraint("order_items", "order_items_quantity_check", {
    check: "quantity > 0",
  });

  pgm.addConstraint("order_items", "order_items_unit_price_check", {
    check: "unit_price >= 0",
  });

  pgm.createIndex("order_items", "order_id");
  pgm.createIndex("order_items", "product_id");
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.dropTable("order_items");
};