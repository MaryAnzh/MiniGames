import { describe, it, expect, beforeEach, vi } from 'vitest';
import { appStore, APP_SESSION_KEY, SESSION_LIFETIME_MS } from '@store';
import { AuthService } from '@services';

describe('AppStore: Session Management', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  const createValidSession = () => ({
    email: 'test@mail.com',
    displayName: 'Tester',
    avatarUrl: '',
    expiresAt: Date.now() + SESSION_LIFETIME_MS,
  });

  const createExpiredSession = () => ({
    ...createValidSession,
    expiresAt: Date.now() - 1,
  });

  it('isValidSession returns true for valid session object', () => {
    const session = createValidSession();

    expect(appStore['isValidSession'](session)).toBe(true);
  });

  it('isValidSession returns false for invalid session object', () => {
    const session = { email: 123, expiresAt: 'wrong' };
    // @ts-ignore
    expect(appStore['isValidSession'](session)).toBe(false);
  });

  it('saveSession writes session to localStorage and updates store', () => {
    const data = {
      email: 'save@mail.com',
      displayName: 'Saver',
      avatarUrl: '',
    };

    appStore['saveSession'](data);

    const raw = JSON.parse(localStorage.getItem(APP_SESSION_KEY) ?? '');

    expect(raw.email).toBe('save@mail.com');
    expect(appStore.userEmail).toBe('save@mail.com');
    expect(appStore.username).toBe('Saver');
    expect(appStore.isAuth).toBe(true);
  });

  it('clearSession removes session and resets auth state', () => {
    localStorage.setItem(APP_SESSION_KEY, JSON.stringify(createValidSession()));

    appStore['clearSession']();

    expect(localStorage.getItem(APP_SESSION_KEY)).toBeNull();
    expect(appStore.isAuth).toBe(false);
    expect(appStore.userEmail).toBe('');
  });

  it('restoreSession loads valid session and sets auth=true', async () => {
    appStore['clearSession']();

    const currentSession = createValidSession();
    localStorage.setItem(APP_SESSION_KEY, JSON.stringify(currentSession));
    appStore['restoreSession']();

    expect(appStore.isAuth).toBe(true);
    expect(appStore.userEmail).toBe(currentSession.email);
  });

  it('restoreSession clears expired session and calls logout', async () => {
    localStorage.setItem(APP_SESSION_KEY, JSON.stringify(createExpiredSession()));
    const logoutSpy = vi.spyOn(AuthService.prototype, 'logout').mockResolvedValue({ ok: true });
    await appStore['restoreSession']();

    expect(appStore.isAuth).toBe(false);
    expect(localStorage.getItem(APP_SESSION_KEY)).toBeNull();
    expect(logoutSpy).toHaveBeenCalled();
  });

  it('restoreSession clears session and calls logout on invalid JSON', async () => {
    localStorage.setItem(APP_SESSION_KEY, 'INVALID_JSON');
    const logoutSpy = vi.spyOn(AuthService.prototype, 'logout').mockResolvedValue({ ok: true });
    await appStore['restoreSession']();

    expect(appStore.isAuth).toBe(false);
    expect(logoutSpy).toHaveBeenCalled();
  });

  it('checkSession returns false when no session exists', async () => {
    const res = await appStore.checkSession();
    expect(res).toBe(false);
  });

  it('checkSession returns true for valid session', async () => {
    localStorage.setItem(APP_SESSION_KEY, JSON.stringify(createValidSession()));

    const res = await appStore.checkSession();
    expect(res).toBe(true);
  });

  it('checkSession clears expired session and returns false', async () => {
    localStorage.setItem(APP_SESSION_KEY, JSON.stringify(createExpiredSession()));
    const logoutSpy = vi.spyOn(AuthService.prototype, 'logout').mockResolvedValue({ ok: true });
    const res = await appStore.checkSession();

    expect(res).toBe(false);
    expect(localStorage.getItem(APP_SESSION_KEY)).toBeNull();
    expect(logoutSpy).toHaveBeenCalled();
  });
});
