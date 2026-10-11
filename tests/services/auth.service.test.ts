import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '@services';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
} from 'firebase/auth';
import type { SnackbarPortal } from '@components';
import {
  LOGGED_OUT,
  LOGIN_SUCCESSFUL,
  LOGIN_WITH_GOOGLE,
  REGISTRATION_SUCCESSFUL,
  SUCCESS,
} from '@constants';

vi.mock('firebase/auth', () => {
  return {
    getAuth: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    updateProfile: vi.fn(),
    GoogleAuthProvider: class {},
    signInWithPopup: vi.fn(),
  };
});

describe('AuthService', () => {
  let snackbar: SnackbarPortal;
  let auth: AuthService;

  beforeEach(() => {
    snackbar = { show: vi.fn() } as unknown as SnackbarPortal;
    auth = new AuthService({ snackbar });
    vi.resetAllMocks();
  });

  it('login returns ok=true on success', async () => {
    const signInMock = signInWithEmailAndPassword as unknown as ReturnType<typeof vi.fn>;

    signInMock.mockResolvedValue({
      user: { email: 'u@mail.com', displayName: 'User' },
    });

    const res = await auth.login('u@mail.com', '123');

    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.user!.email).toBe('u@mail.com');
    }
    expect(snackbar.show).toHaveBeenCalledWith(LOGIN_SUCCESSFUL, SUCCESS);
  });

  it('login returns ok=false on error', async () => {
    const signInMock = signInWithEmailAndPassword as unknown as ReturnType<typeof vi.fn>;

    signInMock.mockRejectedValue({
      name: 'AuthError',
      code: 'wrong-password',
    });

    const res = await auth.login('u@mail.com', '123');

    expect(res.ok).toBe(false);
    expect(snackbar.show).toHaveBeenCalled();
  });

  it('register returns ok=true on success', async () => {
    const createMock = createUserWithEmailAndPassword as unknown as ReturnType<typeof vi.fn>;
    const updateMock = updateProfile as unknown as ReturnType<typeof vi.fn>;

    createMock.mockResolvedValue({
      user: { email: 'u@mail.com', displayName: 'User' },
    });

    updateMock.mockResolvedValue({ user: { email: 'u@mail.com', displayName: 'User' } });

    const res = await auth.register('u@mail.com', '123', 'User');

    expect(res.ok).toBe(true);
    expect(snackbar.show).toHaveBeenCalledWith(REGISTRATION_SUCCESSFUL, SUCCESS);
  });

  it('register returns ok=false on error', async () => {
    const createMock = createUserWithEmailAndPassword as unknown as ReturnType<typeof vi.fn>;

    createMock.mockRejectedValue({
      name: 'AuthError',
      code: 'email-already-in-use',
    });

    const res = await auth.register('u@mail.com', '123', 'User');

    expect(res.ok).toBe(false);
    expect(snackbar.show).toHaveBeenCalled();
  });

  it('loginWithGoogle returns ok=true on success', async () => {
    const popupMock = signInWithPopup as unknown as ReturnType<typeof vi.fn>;

    popupMock.mockResolvedValue({
      user: { email: 'google@mail.com' },
    });

    const res = await auth.loginWithGoogle();

    expect(res.ok).toBe(true);
    expect(snackbar.show).toHaveBeenCalledWith(LOGIN_WITH_GOOGLE, SUCCESS);
  });

  it('loginWithGoogle returns ok=false on error', async () => {
    const popupMock = signInWithPopup as unknown as ReturnType<typeof vi.fn>;

    popupMock.mockRejectedValue({
      name: 'AuthError',
      code: 'popup-closed',
    });

    const res = await auth.loginWithGoogle();

    expect(res.ok).toBe(false);
    expect(snackbar.show).toHaveBeenCalled();
  });

  it('logout returns ok=true on success', async () => {
    const logoutMock = signOut as unknown as ReturnType<typeof vi.fn>;

    logoutMock.mockResolvedValue({ ok: true });

    const res = await auth.logout();

    expect(res.ok).toBe(true);
    expect(snackbar.show).toHaveBeenCalledWith(LOGGED_OUT, 'info');
  });

  it('logout returns ok=false on error', async () => {
    const logoutMock = signOut as unknown as ReturnType<typeof vi.fn>;

    logoutMock.mockRejectedValue({
      name: 'AuthError',
      code: 'logout-failed',
    });

    const res = await auth.logout();

    expect(res.ok).toBe(false);
    expect(snackbar.show).toHaveBeenCalled();
  });
});
