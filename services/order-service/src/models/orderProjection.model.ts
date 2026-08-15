import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import { sequelize } from "./sequelize";

export class OrderProjection extends Model<
  InferAttributes<OrderProjection>,
  InferCreationAttributes<OrderProjection>
> {
  declare id: CreationOptional<string>;

  declare orderId: string;
  declare userId: string;
  declare totalAmount: string;
  declare currency: string;
  declare status: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

OrderProjection.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: "order_id",
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },

    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: "total_amount",
    },

    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
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
    tableName: "order_projections",
    modelName: "OrderProjection",
    timestamps: true,
    underscored: true,
  }
);