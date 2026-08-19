import { orderCreatedEventSchema } from "./orderCreated.schema";
import { OrderCreatedEvent } from "./orderCreated.event";

import { orderStatusChangedEventSchema } from "./orderStatusChanged.schema";
import { OrderStatusChangedEvent } from "./orderStatusChanged.event";

export type OrderEvent =
  | OrderCreatedEvent
  | OrderStatusChangedEvent;

export const parseOrderEvent = (
  value: string
): OrderEvent => {
  let parsedEvent: unknown;

  try {
    parsedEvent = JSON.parse(value);
  } catch {
    throw new Error("Invalid JSON received from Kafka");
  }

  if (
    typeof parsedEvent !== "object" ||
    parsedEvent === null ||
    !("eventType" in parsedEvent)
  ) {
    throw new Error(
      "Invalid order event: missing eventType"
    );
  }

  const eventType = (parsedEvent as {
    eventType: unknown;
  }).eventType;

  switch (eventType) {
    case "OrderCreated": {
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
    }

    case "OrderStatusChanged": {
      const { error, value: validatedEvent } =
        orderStatusChangedEventSchema.validate(
          parsedEvent,
          {
            abortEarly: false,
            stripUnknown: false,
          }
        );

      if (error) {
        throw new Error(
          `Invalid OrderStatusChanged event: ${error.message}`
        );
      }

      return validatedEvent as OrderStatusChangedEvent;
    }

    default:
      throw new Error(
        `Unsupported order event type: ${String(eventType)}`
      );
  }
};