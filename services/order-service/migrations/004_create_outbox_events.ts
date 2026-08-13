import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.createType("outbox_event_status", [
    "PENDING",
    "PROCESSING",
    "PUBLISHED",
    "FAILED",
  ]);

  pgm.createTable("outbox_events", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    aggregate_type: {
      type: "varchar(100)",
      notNull: true,
    },

    aggregate_id: {
      type: "uuid",
      notNull: true,
    },

    event_type: {
      type: "varchar(100)",
      notNull: true,
    },

    payload: {
      type: "jsonb",
      notNull: true,
    },

    status: {
      type: "outbox_event_status",
      notNull: true,
      default: "PENDING",
    },

    attempts: {
      type: "integer",
      notNull: true,
      default: 0,
    },

    last_error: {
      type: "text",
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    processed_at: {
      type: "timestamptz",
    },
  });

  pgm.createIndex("outbox_events", ["status", "created_at"]);

  pgm.createIndex("outbox_events", ["aggregate_type", "aggregate_id"]);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.dropTable("outbox_events");
  pgm.dropType("outbox_event_status");
};