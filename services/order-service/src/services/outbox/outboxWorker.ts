import { OutboxRelayService } from "./outboxRelay.service";

export class OutboxWorker {
  private interval: NodeJS.Timeout | null = null;

  constructor(
    private readonly relayService: OutboxRelayService,
    private readonly intervalMs = 2000
  ) {}

  start(): void {
    console.log(
      `🚀 Outbox worker started (polling every ${this.intervalMs}ms)`
    );

    // Process immediately on startup.
    void this.relayService.processBatch();

    this.interval = setInterval(() => {
      void this.relayService.processBatch();
    }, this.intervalMs);
  }

  stop(): void {
    if (!this.interval) {
      return;
    }

    clearInterval(this.interval);
    this.interval = null;

    console.log("🛑 Outbox worker stopped");
  }
}