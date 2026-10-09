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

const googleProvider = new GoogleAuthProvider();

export class AuthService {
  private snackbar: SnackbarPortal;

  constructor({ snackbar }: { snackbar: SnackbarPortal }) {
    this.snackbar = snackbar;
  }

  async loginWithGoogle(): Promise<FirebaseUserResponseType> {
    try {
      const cred = await signInWithPopup(firebaseAuth, googleProvider);

      this.snackbar.show('Your login with Google!', 'success');
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

      this.snackbar.show('Registration successful', 'success');
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

      this.snackbar.show('Login successful', 'success');
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

      this.snackbar.show(
        isSessionExpired ? 'Your session has expired. Please sign in again.' : 'Logged out',
        'info',
      );
      return { ok: true };
    } catch (e) {
      const err = e as FirebaseError;
      const message = err ? `${err.name}: ${err.code}` : 'Login failed';
      this.snackbar.show(message ?? 'Logout failed', 'error');
      return { ok: false, error: err };
    }
  }
}
