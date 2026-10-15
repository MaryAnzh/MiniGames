export type FirebaseUserType = {
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
};

export type FirebaseUserDataType = FirebaseUserType;

export type FirebaseAuthError = {
  name: 'FirebaseError';
  message: string;
  code: string;
  stack?: string;
};

export type FirebaseUserResponseType =
  { ok: true; user: FirebaseUserDataType } | { ok: false; error: FirebaseAuthError };
