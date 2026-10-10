import { describe, it, expect, beforeEach, vi } from 'vitest';
import { appStore, APP_SESSION_KEY } from '@store';
import { ERROR } from '@constants';

vi.mock('@services', () => {
  return {
    ApiService: class {
      getGameDetails = vi.fn();
      getGameComments = vi.fn();
    },
    AuthService: class {
      login = vi.fn();
      loginWithGoogle = vi.fn();
      register = vi.fn();
      logout = vi.fn();
    },
  };
});

describe('AppStore: Error Handling', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    appStore['clearSession']();
  });

  it('restoreSession handles invalid JSON in localStorage', async () => {
    localStorage.setItem(APP_SESSION_KEY, 'INVALID_JSON');

    const logoutSpy = appStore['auth'].logout as any;
    logoutSpy.mockResolvedValue({ ok: true });

    await appStore['restoreSession']();

    expect(appStore.isAuth).toBe(false);
    expect(logoutSpy).toHaveBeenCalled();
    expect(localStorage.getItem(APP_SESSION_KEY)).toBeNull();
  });

  it('restoreSession handles invalid session shape', async () => {
    localStorage.setItem(APP_SESSION_KEY, JSON.stringify({ email: 123 }));

    const logoutSpy = appStore['auth'].logout as any;
    logoutSpy.mockResolvedValue({ ok: true });

    await appStore['restoreSession']();

    expect(appStore.isAuth).toBe(false);
    expect(logoutSpy).toHaveBeenCalled();
  });

  it('restoreSession handles expired session', async () => {
    localStorage.setItem(
      APP_SESSION_KEY,
      JSON.stringify({
        email: 'expired@mail.com',
        displayName: 'Expired',
        expiresAt: Date.now() - 1000,
      }),
    );

    const logoutSpy = appStore['auth'].logout as any;
    logoutSpy.mockResolvedValue({ ok: true });

    await appStore['restoreSession']();

    expect(appStore.isAuth).toBe(false);
    expect(logoutSpy).toHaveBeenCalled();
    expect(localStorage.getItem(APP_SESSION_KEY)).toBeNull();
  });

  it('checkSession handles invalid JSON', async () => {
    localStorage.setItem(APP_SESSION_KEY, 'INVALID');

    const logoutSpy = appStore['auth'].logout as any;
    logoutSpy.mockResolvedValue({ ok: true });

    const result = await appStore.checkSession();

    expect(result).toBe(false);
    expect(logoutSpy).toHaveBeenCalled();
  });

  it('checkSession handles invalid session shape', async () => {
    localStorage.setItem(APP_SESSION_KEY, JSON.stringify({ email: 123 }));

    const logoutSpy = appStore['auth'].logout as any;
    logoutSpy.mockResolvedValue({ ok: true });

    const result = await appStore.checkSession();

    expect(result).toBe(false);
    expect(logoutSpy).toHaveBeenCalled();
  });

  it('postComment returns error when user is not authenticated', async () => {
    const res = await appStore.postComment('slug', 'hello');

    expect(res.status).toBe(ERROR);
    if (res.status === ERROR) {
      expect(res.error).toBe('User is not authenticated');
    }
  });

  it('getGameDetails handles ApiService error', async () => {
    const apiSpy = appStore['api'].getGameDetails as any;
    apiSpy.mockRejectedValue(new Error('API failure'));

    vi.spyOn(appStore, 'checkSession').mockResolvedValue(true);

    appStore.setAuthData({
      isAuth: true,
      email: 'user@mail.com',
      displayName: 'User',
    });

    await expect(appStore.getGameDetails('slug')).rejects.toThrow('API failure');
  });

  it('logout handles AuthService error', async () => {
    const logoutSpy = appStore['auth'].logout as any;
    logoutSpy.mockRejectedValue(new Error('Logout failed'));

    await expect(appStore.logout()).rejects.toThrow('Logout failed');
  });
});
