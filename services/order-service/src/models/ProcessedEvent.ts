import {
  Model,
  DataTypes,
  Optional,
} from "sequelize";
import { sequelize } from "./sequelize";

export type ProcessedEventStatus =
  | "PROCESSING"
  | "COMPLETED";

interface ProcessedEventAttributes {
  eventId: string;
  eventType: string;
  status: ProcessedEventStatus;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ProcessedEventCreationAttributes
  extends Optional<
    ProcessedEventAttributes,
    "status" | "processedAt" | "createdAt" | "updatedAt"
  > {}

export class ProcessedEvent
  extends Model<
    ProcessedEventAttributes,
    ProcessedEventCreationAttributes
  >
  implements ProcessedEventAttributes
{
  declare eventId: string;
  declare eventType: string;
  declare status: ProcessedEventStatus;
  declare processedAt: Date | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ProcessedEvent.init(
  {
    eventId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      field: "event_id",
    },

    eventType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "event_type",
    },

    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "PROCESSING",
    },

    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "processed_at",
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "processed_events",
    timestamps: true,
    underscored: true,
  }
);