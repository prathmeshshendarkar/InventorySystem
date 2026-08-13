import { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder): void => {
  pgm.addColumn("outbox_events", {
    processing_at: {
      type: "timestamptz",
      notNull: false,
    },
  });

  pgm.createIndex(
    "outbox_events",
    ["status", "processing_at"]
  );
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.dropIndex(
    "outbox_events",
    ["status", "processing_at"]
  );

  pgm.dropColumn("outbox_events", "processing_at");
};