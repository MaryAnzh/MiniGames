export type UserDataType = { email?: string; displayName?: string; avatarUrl?: string };

export type SessionType = UserDataType & {
  expiresAt: number;
};

export type AuthStoreDataType = UserDataType & {
  isAuth: boolean;
};
