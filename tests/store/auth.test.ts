import { describe, it, expect, beforeEach, vi } from 'vitest';
import { appStore, APP_SESSION_KEY } from '@store';
import { AuthService } from '@services';

describe('AppStore: Auth Flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    appStore['clearSession']();
  });

  const authData = {
    isAuth: true,
    email: 'user@mail.com',
    displayName: 'User',
    avatarUrl: 'img.png',
  };

  it('setAuthData updates auth fields and emits event', () => {
    const emitSpy = vi.spyOn(appStore, 'isAuth', 'set');
    appStore.setAuthData(authData);

    expect(appStore.isAuth).toBe(true);
    expect(appStore.userEmail).toBe(authData.email);
    expect(appStore.username).toBe(authData.displayName);
    expect(appStore.photoURL).toBe(authData.avatarUrl);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('login saves session on success', async () => {
    const loginSpy = vi.spyOn(AuthService.prototype, 'login').mockResolvedValue({
      ok: true,
      user: {
        email: authData.email,
        displayName: authData.displayName,
        photoURL: 'avatar.png',
      },
    });

    await appStore.login(authData.email, '123');

    expect(loginSpy).toHaveBeenCalled();
    expect(appStore.isAuth).toBe(true);
    expect(appStore.userEmail).toBe(authData.email);
    expect(appStore.username).toBe(authData.displayName);

    const raw = JSON.parse(localStorage.getItem(APP_SESSION_KEY) ?? '');
    expect(raw.email).toBe(authData.email);
  });

  it('loginWithGoogle saves session on success', async () => {
    const googleSpy = vi.spyOn(AuthService.prototype, 'loginWithGoogle').mockResolvedValue({
      ok: true,
      user: {
        email: 'google@mail.com',
        displayName: 'GoogleUser',
        photoURL: 'google.png',
      },
    });

    await appStore.loginWithGoogle();

    expect(googleSpy).toHaveBeenCalled();
    expect(appStore.isAuth).toBe(true);
    expect(appStore.userEmail).toBe('google@mail.com');
    expect(appStore.username).toBe('GoogleUser');
  });

  it('register saves session on success', async () => {
    const registerSpy = vi.spyOn(AuthService.prototype, 'register').mockResolvedValue({
      ok: true,
      user: {
        email: 'reg@mail.com',
        displayName: 'RegUser',
      },
    });

    await appStore.register('reg@mail.com', '123', 'RegUser');

    expect(registerSpy).toHaveBeenCalled();
    expect(appStore.isAuth).toBe(true);
    expect(appStore.userEmail).toBe('reg@mail.com');
    expect(appStore.username).toBe('RegUser');
  });

  it('logout clears session on success', async () => {
    appStore.setAuthData(authData);

    localStorage.setItem(
      APP_SESSION_KEY,
      JSON.stringify({
        expiresAt: Date.now() + 10000,
        ...authData,
      }),
    );

    const logoutSpy = vi.spyOn(AuthService.prototype, 'logout').mockResolvedValue({ ok: true });

    await appStore.logout();

    expect(logoutSpy).toHaveBeenCalled();
    expect(appStore.isAuth).toBe(false);
    expect(appStore.userEmail).toBe('');
    expect(localStorage.getItem(APP_SESSION_KEY)).toBeNull();
  });
});
