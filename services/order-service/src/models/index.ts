export { Order, OrderStatus } from "./order";
export { OrderItem } from "./orderItem";

import { Order } from "./order";
import { OrderItem } from "./orderItem";

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});