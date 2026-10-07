import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { firebaseAuth } from '../../firebaseConfig';
import type {
  ErrorMessageType,
  FirebaseAuthError,
  FirebaseUserDataType,
  FirebaseUserResponseType,
} from '@types';

import { snackbar } from './snackbar';
import type { FirebaseError } from 'firebase/app';

export class AuthService {
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
        snackbar.show(err.message ?? 'Update userName failed', 'error');
      }

      snackbar.show('Registration successful', 'success');
      const user = cred.user as FirebaseUserDataType;

      return {
        ok: true,
        user,
      };
    } catch (e) {
      const err = e as FirebaseAuthError;
      const message = err ? `${err.name}: ${err.code}` : 'Registration failed';
      snackbar.show(message, 'error');
      return { ok: false, error: err };
    }
  }

  async login(email: string, password: string): Promise<FirebaseUserResponseType> {
    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);

      snackbar.show('Login successful', 'success');
      const user = <FirebaseUserDataType>cred.user;

      return {
        ok: true,
        user,
      };
    } catch (e) {
      const err = e as FirebaseAuthError;
      const message = err ? `${err.name}: ${err.code}` : 'Login failed';
      snackbar.show(message, 'error');
      return { ok: false, error: err };
    }
  }

  async logout() {
    try {
      await signOut(firebaseAuth);
      snackbar.show('Logged out', 'info');
      return { ok: true };
    } catch (e) {
      const err = e as FirebaseError;
      const message = err ? `${err.name}: ${err.code}` : 'Login failed';
      snackbar.show(message ?? 'Logout failed', 'error');
      return { ok: false, error: err };
    }
  }
}

export const authService = new AuthService();
