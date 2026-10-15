import type { CustomEventsType } from '@types';

export class EventEmitter {
  private events: Record<CustomEventsType, Array<(data?: string) => void>> = {
    'route:change': [],
    'auth:change': [],
  };

  on(event: CustomEventsType, callback: (data?: string) => void) {
    this.events[event].push(callback);
  }

  emit(event: CustomEventsType, data?: string) {
    this.events[event].forEach((cb) => cb(data));
  }
}

export const appEvents = new EventEmitter();
