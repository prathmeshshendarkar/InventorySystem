import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.addColumn("order_projections", {
    user_id: {
      type: "uuid",
      notNull: true,
    },

    currency: {
      type: "varchar(3)",
      notNull: true,
    },
  });

  pgm.dropColumn("order_projections", "customer_id");
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.addColumn("order_projections", {
    customer_id: {
      type: "uuid",
      notNull: true,
    },
  });

  pgm.dropColumn("order_projections", "user_id");
  pgm.dropColumn("order_projections", "currency");
};