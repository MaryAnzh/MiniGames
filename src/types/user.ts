import type { User } from 'firebase/auth';

export type FirebaseUserType = {
  uid: string;
  email: string | null;
  displayName: string | null;

  emailVerified: boolean;
};

export type FirebaseUserDataType = User &
  FirebaseUserType & {
    metadata: {
      createdAt: string;
      lastLoginAt: string;
      lastSignInTime?: string;
    };

    stsTokenManager: {
      accessToken: string;
      expirationTime: number;
    };
  };

export type FirebaseAuthError = {
  name: 'FirebaseError';
  message: string;
  code: string; // auth/invalid-credential, auth/email-already-in-use, etc.
  stack?: string;
};

export type FirebaseUserResponseType =
  { ok: true; user: FirebaseUserDataType } | { ok: false; error: FirebaseAuthError };
