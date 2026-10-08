import * as C from '@constants';
import type { AuthTabType } from '@types';
const { EMAIL, PASSWORD } = C.INPUT_TYPES;

export function validateEmail(value: string): string {
  if (!value) return C.INVALID_EMAIL_FORMAT;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return C.INVALID_EMAIL_FORMAT;
  return '';
}

export function validateUsername(value: string): string {
  if (!value) return C.USERNAME_IS_REQUIRED;
  if (value.length < 2 || value.length > 30) return C.NAME_LENGTH_MESSAGE;
  if (!/^[A-Z][A-Za-z0-9]*$/.test(value)) return C.USERNAME_CHECK_MESSAGE;
  return '';
}

export function validatePasswordLogin(value: string): string {
  if (!value) return C.PASSWORD_IS_REQUIRED;
  if (value.length < 6) return C.MIN_PASS_LENGTH;
  return '';
}

export function validatePasswordRegister(value: string): string {
  if (!value) return C.PASSWORD_IS_REQUIRED;
  if (value.length < 6) return C.MIN_PASS_LENGTH;
  if (!/[A-Z]/.test(value)) return C.PASS_UPPERCASE_LETTER;
  if (!/[0-9]/.test(value)) return C.PASS_DIGITAL;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return C.PASS_SPACIAL_CHARACTER;
  return '';
}

export function validateConfirmPassword(value: string, password: string): string {
  if (!value) return C.CONFIRM_YOUR_PASSWORD;
  if (value !== password) return C.PASSWORDS_DO_NOT_MATCH;
  return '';
}

export function validateField(
  tab: AuthTabType,
  name: string,
  value: string,
  fields: Record<string, string>,
) {
  if (name === EMAIL) return validateEmail(value);
  if (name === C.USERNAME) return validateUsername(value);

  if (name === PASSWORD && tab === C.LOGIN) return validatePasswordLogin(value);
  if (name === PASSWORD && tab === C.REGISTER) return validatePasswordRegister(value);

  if (name === C.CONFIRM) return validateConfirmPassword(value, fields.password);

  return '';
}
