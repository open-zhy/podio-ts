import { Event, toEvent } from "../deps.ts";

export type EventType = "podio.request" | "podio.response" | "podio.error";

export class EventHandler {
  private events = new Event<
    | ["podio.request", Function]
    | ["podio.response", Function]
    | ["podio.error", Function]
  >();

  on(eventName: EventType, handler: any): void {
    this.events.$attach(toEvent(eventName), handler);
  }

  fire(eventName: string, ...args: any[]): any {
    const callArgs: any = [
      eventName,
      ...args,
    ];

    this.events.post.call(this.events, callArgs);
  }
}
