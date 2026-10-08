import { describe, test, expect } from 'vitest';

import * as V from '@utils';
import * as C from '@constants';

const { EMAIL, PASSWORD } = C.INPUT_TYPES;

describe('Utils: Validation auth form', () => {
  const validEmail = 'test@mail.com';
  const validPassword = 'Abc123!';
  const fields = { password: validPassword };
  const wrong = 'wrong';

  test('Email: validateEmail', () => {
    expect(V.validateEmail('')).toBe(C.INVALID_EMAIL_FORMAT);
    expect(V.validateEmail(wrong)).toBe(C.INVALID_EMAIL_FORMAT);
    expect(V.validateEmail(validEmail)).toBe('');
  });

  test('User name: validateUsername', () => {
    expect(V.validateUsername('')).toBe(C.USERNAME_IS_REQUIRED);
    expect(V.validateUsername('a')).toBe(C.NAME_LENGTH_MESSAGE);
    expect(V.validateUsername('ab')).toBe(C.USERNAME_CHECK_MESSAGE); // must start with uppercase
    expect(V.validateUsername('John')).toBe('');
    expect(V.validateUsername('John123')).toBe('');
  });

  test('Login Password: validatePasswordLogin', () => {
    expect(V.validatePasswordLogin('')).toBe(C.PASSWORD_IS_REQUIRED);
    expect(V.validatePasswordLogin('123')).toBe(C.MIN_PASS_LENGTH);
    expect(V.validatePasswordLogin('123456')).toBe('');
  });

  test('Registration password: validatePasswordRegister', () => {
    expect(V.validatePasswordRegister('')).toBe(C.PASSWORD_IS_REQUIRED);
    expect(V.validatePasswordRegister('123')).toBe(C.MIN_PASS_LENGTH);
    expect(V.validatePasswordRegister('abcdef')).toBe(C.PASS_UPPERCASE_LETTER);
    expect(V.validatePasswordRegister('ABCDEF')).toBe(C.PASS_DIGITAL);
    expect(V.validatePasswordRegister('Abcdef')).toBe(C.PASS_DIGITAL);
    expect(V.validatePasswordRegister('Abc123')).toBe(C.PASS_SPACIAL_CHARACTER);
    expect(V.validatePasswordRegister('Abc123!')).toBe('');
  });

  test('Confirm Password: validateConfirmPassword', () => {
    expect(V.validateConfirmPassword('', validPassword)).toBe(C.CONFIRM_YOUR_PASSWORD);
    expect(V.validateConfirmPassword(wrong, validPassword)).toBe(C.PASSWORDS_DO_NOT_MATCH);
    expect(V.validateConfirmPassword(validPassword, validPassword)).toBe('');
  });

  test('Login: validateField', () => {
    expect(V.validateField(C.LOGIN, EMAIL, '', fields)).toBe(C.INVALID_EMAIL_FORMAT);
    expect(V.validateField(C.LOGIN, PASSWORD, '', fields)).toBe(C.PASSWORD_IS_REQUIRED);
    expect(V.validateField(C.LOGIN, PASSWORD, '123', fields)).toBe(C.MIN_PASS_LENGTH);
    expect(V.validateField(C.LOGIN, PASSWORD, '123456', fields)).toBe('');
  });

  test('Register: validateField', () => {
    expect(V.validateField(C.REGISTER, EMAIL, '', fields)).toBe(C.INVALID_EMAIL_FORMAT);
    expect(V.validateField(C.REGISTER, C.USERNAME, '', fields)).toBe(C.USERNAME_IS_REQUIRED);
    expect(V.validateField(C.REGISTER, PASSWORD, '', fields)).toBe(C.PASSWORD_IS_REQUIRED);
    expect(V.validateField(C.REGISTER, PASSWORD, 'Abc123!', fields)).toBe('');
    expect(V.validateField(C.REGISTER, C.CONFIRM, '', fields)).toBe(C.CONFIRM_YOUR_PASSWORD);
    expect(V.validateField(C.REGISTER, C.CONFIRM, wrong, fields)).toBe(C.PASSWORDS_DO_NOT_MATCH);
    expect(V.validateField(C.REGISTER, C.CONFIRM, validPassword, fields)).toBe('');
  });
});
