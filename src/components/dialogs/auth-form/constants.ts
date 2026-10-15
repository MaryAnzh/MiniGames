import type { FieldType } from './types';

export const LOGIN_FIELDS: FieldType[] = [
  {
    label: 'Email Address',
    placeholder: 'e.g. alex@minigames.com',
    type: 'email',
    leftIcon: 'mail',
    id: 'loginEmail',
    name: 'email',
  },
  {
    label: 'Password',
    placeholder: '••••••••',
    type: 'password',
    leftIcon: 'lock',
    rightIcon: 'visibility_off',
    id: 'loginPass',
    name: 'password',
  },
];

export const REGISTER_FIELDS: FieldType[] = [
  {
    label: 'Username',
    placeholder: 'e.g. CozyGamer_99',
    leftIcon: 'person',
    id: 'registerUserName',
    name: 'username',
  },
  {
    label: 'Email Address',
    placeholder: 'your.email@domain.com',
    type: 'email',
    leftIcon: 'mail',
    id: 'registerEmail',
    name: 'email',
  },
  {
    label: 'Password',
    placeholder: 'Min. 8 characters',
    type: 'password',
    leftIcon: 'lock',
    rightIcon: 'visibility_off',
    id: 'registerPass',
    name: 'password',
  },
  {
    label: 'Confirm Password',
    placeholder: 'Repeat your password',
    type: 'password',
    leftIcon: 'lock',
    rightIcon: 'visibility_off',
    id: 'registerPassRepeat',
    name: 'confirm',
  },
];
