import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.createTable("processed_events", {
    event_id: {
      type: "uuid",
      primaryKey: true,
      notNull: true,
    },

    event_type: {
      type: "varchar(100)",
      notNull: true,
    },

    status: {
      type: "varchar(20)",
      notNull: true,
      default: "'PROCESSING'",
    },

    processed_at: {
      type: "timestamptz",
      notNull: false,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: "now()",
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: "now()",
    },
  });
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.dropTable("processed_events");
};