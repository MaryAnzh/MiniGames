import { LOGIN, REGISTER, INPUT_TYPES } from '@constants';
const { EMAIL, PASSWORD } = INPUT_TYPES;

export function validateEmail(value: string): string {
  if (!value) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return 'Invalid email format';
  return '';
}

export function validateUsername(value: string): string {
  if (!value) return 'Username is required';
  if (value.length < 2 || value.length > 30) return '2–30 characters required';
  if (!/^[A-Z][A-Za-z0-9]*$/.test(value))
    return 'Must start with uppercase and contain only letters/digits';
  return '';
}

export function validatePasswordLogin(value: string): string {
  if (!value) return 'Password is required';
  if (value.length < 6) return 'Minimum 6 characters';
  return '';
}

export function validatePasswordRegister(value: string): string {
  if (!value) return 'Password is required';
  if (value.length < 6) return 'Minimum 6 characters';
  if (!/[A-Z]/.test(value)) return 'Must contain uppercase letter';
  if (!/[0-9]/.test(value)) return 'Must contain a digit';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Must contain a special character';
  return '';
}

export function validateConfirmPassword(value: string, password: string): string {
  if (!value) return 'Confirm your password';
  if (value !== password) return 'Passwords do not match';
  return '';
}

export function validateField(
  tab: string,
  name: string,
  value: string,
  fields: Record<string, string>,
) {
  if (name === EMAIL) return validateEmail(value);
  if (name === 'username') return validateUsername(value);

  if (name === PASSWORD && tab === LOGIN) return validatePasswordLogin(value);
  if (name === PASSWORD && tab === REGISTER) return validatePasswordRegister(value);

  if (name === 'confirm') return validateConfirmPassword(value, fields.password);

  return '';
}
