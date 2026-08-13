import { orderCreatedEventSchema } from "./orderCreated.schema";
import { OrderCreatedEvent } from "./orderCreated.event";

export const parseOrderCreatedEvent = (
  value: string
): OrderCreatedEvent => {
  let parsedEvent: unknown;

  try {
    parsedEvent = JSON.parse(value);
  } catch {
    throw new Error("Invalid JSON received from Kafka");
  }

  const { error, value: validatedEvent } =
    orderCreatedEventSchema.validate(parsedEvent, {
      abortEarly: false,
      stripUnknown: false,
    });

  if (error) {
    throw new Error(
      `Invalid OrderCreated event: ${error.message}`
    );
  }

  return validatedEvent as OrderCreatedEvent;
};