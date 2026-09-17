import type { CustomEventsType } from '@types';

export class EventEmitter {
  private events: Record<string, Array<(data?: string | undefined) => void>> = {};

  on(event: CustomEventsType, callback: (data?: string | undefined) => void) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }

  emit(event: CustomEventsType, data?: string | undefined) {
    this.events[event]?.forEach((cb) => cb(data));
  }
}

export const appEvents = new EventEmitter();
