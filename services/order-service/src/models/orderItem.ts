import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "./sequelize";

export class OrderItem extends Model<
  InferAttributes<OrderItem>,
  InferCreationAttributes<OrderItem>
> {
  declare id: CreationOptional<string>;

  declare orderId: string;
  declare productId: string;

  declare quantity: number;
  declare unitPrice: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "order_id",
    },

    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "product_id",
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    unitPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: "unit_price",
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
    tableName: "order_items",
    modelName: "OrderItem",

    timestamps: true,

    underscored: true,
  }
);