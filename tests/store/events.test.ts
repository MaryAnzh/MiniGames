import { describe, it, expect, beforeEach, vi } from 'vitest';
import { appStore } from '@store';
import { appEvents } from '@utils';
import { CUSTOM_EVENTS } from '@constants';

describe('AppStore: Events', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    appStore['clearSession']();
  });

  it('emits AUTH_CHANGE when isAuth changes', () => {
    const emitSpy = vi.spyOn(appEvents, 'emit').mockImplementation(() => {});

    appStore.isAuth = true;

    expect(emitSpy).toHaveBeenCalledWith(CUSTOM_EVENTS.AUTH_CHANGE, 'true');

    appStore.isAuth = false;

    expect(emitSpy).toHaveBeenCalledWith(CUSTOM_EVENTS.AUTH_CHANGE, 'false');
  });

  it('emits ROUTE_CHANGE when currentRoute changes', () => {
    const emitSpy = vi.spyOn(appEvents, 'emit').mockImplementation(() => {});

    appStore.currentRoute = '/games';

    expect(emitSpy).toHaveBeenCalledWith(CUSTOM_EVENTS.ROUTE_CHANGE, '/games');
  });

  it('showSnack calls snackbar.show', () => {
    const snackSpy = vi.spyOn(appStore['snackbar'], 'show').mockImplementation(() => {});

    appStore.showSnack('Hello', 'success');

    expect(snackSpy).toHaveBeenCalledWith('Hello', 'success');
  });
});
