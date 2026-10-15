import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

import { firebaseAuth } from '../../firebaseConfig';
import type {
  ErrorMessageType,
  FirebaseAuthError,
  FirebaseUserDataType,
  FirebaseUserResponseType,
} from '@types';

import type { FirebaseError } from 'firebase/app';
import type { SnackbarPortal } from '@components';
import {
  ERROR,
  LOGGED_OUT,
  LOGIN_SUCCESSFUL,
  LOGIN_WITH_GOOGLE,
  REGISTRATION_SUCCESSFUL,
  SESSION_HAS_EXPIRED,
  SUCCESS,
} from '@constants';

const googleProvider = new GoogleAuthProvider();

export class AuthService {
  private snackbar: SnackbarPortal;

  constructor({ snackbar }: { snackbar: SnackbarPortal }) {
    this.snackbar = snackbar;
  }

  async loginWithGoogle(): Promise<FirebaseUserResponseType> {
    try {
      const cred = await signInWithPopup(firebaseAuth, googleProvider);

      this.snackbar.show(LOGIN_WITH_GOOGLE, SUCCESS);
      return {
        ok: true,
        user: cred.user as FirebaseUserDataType,
      };
    } catch (e) {
      const err = e as FirebaseAuthError;
      const message = err ? `${err.name}: ${err.code}` : 'Auth with Google failed';
      this.snackbar.show(message, 'error');
      return { ok: false, error: err };
    }
  }

  async register(
    email: string,
    password: string,
    username: string,
  ): Promise<FirebaseUserResponseType> {
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);

      try {
        await updateProfile(cred.user, { displayName: username });
      } catch (e) {
        const err = e as ErrorMessageType;
        this.snackbar.show(err.message ?? 'Update userName failed', 'error');
      }

      this.snackbar.show(REGISTRATION_SUCCESSFUL, SUCCESS);
      const user = cred.user as FirebaseUserDataType;

      return {
        ok: true,
        user,
      };
    } catch (e) {
      const err = e as FirebaseAuthError;
      const message = err ? `${err.name}: ${err.code}` : 'Registration failed';
      this.snackbar.show(message, 'error');
      return { ok: false, error: err };
    }
  }

  async login(email: string, password: string): Promise<FirebaseUserResponseType> {
    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);

      this.snackbar.show(LOGIN_SUCCESSFUL, SUCCESS);
      const user = <FirebaseUserDataType>cred.user;

      return {
        ok: true,
        user,
      };
    } catch (e) {
      const err = e as FirebaseAuthError;
      const message = err ? `${err.name}: ${err.code}` : 'Login failed';
      this.snackbar.show(message, 'error');
      return { ok: false, error: err };
    }
  }

  async logout(isSessionExpired?: boolean) {
    try {
      await signOut(firebaseAuth);

      this.snackbar.show(isSessionExpired ? SESSION_HAS_EXPIRED : LOGGED_OUT, 'info');
      return { ok: true };
    } catch (e) {
      const err = e as FirebaseError;
      const message = err ? `${err.name}: ${err.code}` : 'Login failed';
      this.snackbar.show(message ?? LOGGED_OUT, ERROR);
      return { ok: false, error: err };
    }
  }
}
