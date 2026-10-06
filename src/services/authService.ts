import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

import { firebaseAuth } from '../../firebaseConfig';
import type { ErrorMessageType } from '@types';

import { snackbar } from './snackbar';

export class AuthService {
  async register(email: string, password: string) {
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      snackbar.show('Registration successful', 'success');
      return { ok: true, user: cred.user };
    } catch (e) {
      const err = e as ErrorMessageType;
      snackbar.show(err.message ?? 'Registration failed', 'error');
      return { ok: false, error: err };
    }
  }

  async login(email: string, password: string) {
    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      snackbar.show('Login successful', 'success');
      return { ok: true, user: cred.user };
    } catch (e) {
      const err = e as ErrorMessageType;

      snackbar.show(err.message ?? 'Login failed', 'error');
      return { ok: false, error: err };
    }
  }

  async logout() {
    try {
      await signOut(firebaseAuth);
      snackbar.show('Logged out', 'info');
      return { ok: true };
    } catch (e) {
      const err = e as ErrorMessageType;
      snackbar.show(err.message ?? 'Logout failed', 'error');
      return { ok: false, error: err };
    }
  }
}

export const authService = new AuthService();
