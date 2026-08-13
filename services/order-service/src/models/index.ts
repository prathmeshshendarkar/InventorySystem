export { Order } from "./order";
export { OrderItem } from "./orderItem";
export { OrderStatus } from "./orderStatus";
export { OutboxEvent } from "./outboxEvent";
export { OutboxEventStatus } from "./outboxEventStatus";

export { sequelize } from "./sequelize";

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
