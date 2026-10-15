import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventEmitter } from 'src/utils/event-emitter';

describe('EventEmitter', () => {
  let emitter: EventEmitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  it('registers event listeners with on()', () => {
    const cb = vi.fn();

    emitter.on('route:change', cb);

    emitter.emit('route:change', '123');
    expect(cb).toHaveBeenCalledWith('123');
  });

  it('calls all listeners subscribed to the same event', () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();

    emitter.on('auth:change', cb1);
    emitter.on('auth:change', cb2);

    emitter.emit('auth:change', 'true');

    expect(cb1).toHaveBeenCalledWith('true');
    expect(cb2).toHaveBeenCalledWith('true');
  });

  it('does not call listeners of other events', () => {
    const cb = vi.fn();

    emitter.on('route:change', cb);

    emitter.emit('auth:change', 'false');

    expect(cb).not.toHaveBeenCalled();
  });

  it('supports multiple emits', () => {
    const cb = vi.fn();

    emitter.on('route:change', cb);

    emitter.emit('route:change', '1');
    emitter.emit('route:change', '2');

    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenNthCalledWith(1, '1');
    expect(cb).toHaveBeenNthCalledWith(2, '2');
  });

  it('works with undefined data', () => {
    const cb = vi.fn();

    emitter.on('auth:change', cb);

    emitter.emit('auth:change');

    expect(cb).toHaveBeenCalledWith(undefined);
  });
});
