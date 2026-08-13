import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "./sequelize";
import { OutboxEventStatus } from "./outboxEventStatus";

export class OutboxEvent extends Model<
  InferAttributes<OutboxEvent>,
  InferCreationAttributes<OutboxEvent>
> {
  declare id: CreationOptional<string>;

  declare aggregateType: string;
  declare aggregateId: string;
  declare eventType: string;

  declare payload: Record<string, unknown>;

  declare status: CreationOptional<OutboxEventStatus>;

  declare attempts: CreationOptional<number>;
  declare lastError: string | null;

  declare createdAt: CreationOptional<Date>;
  declare processedAt: Date | null;
  declare processingAt: Date | null;
}

OutboxEvent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    aggregateType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "aggregate_type",
    },

    aggregateId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "aggregate_id",
    },

    eventType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "event_type",
    },

    payload: {
      type: DataTypes.JSONB,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(...Object.values(OutboxEventStatus)),
      allowNull: false,
      defaultValue: OutboxEventStatus.PENDING,
    },

    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    lastError: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "last_error",
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },

    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "processed_at",
    },

    processingAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "processing_at",
    },

  },
  {
    sequelize,
    tableName: "outbox_events",
    modelName: "OutboxEvent",

    timestamps: false,
    underscored: true,
  }
);