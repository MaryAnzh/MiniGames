export const COMPONENT_SIZES = {
  SM: 'sm',
  MD: 'md',
  LH: 'lg',
} as const;

export const COMPONENT_ALIGN = { LEFT: 'left', RIGHT: 'right', CENTER: 'center' } as const;
export const { CENTER, LEFT, RIGHT } = COMPONENT_ALIGN;
export const COLOR_VARIANT = { LIGHT: 'light', DARK: 'dark' } as const;
export const { DARK, LIGHT } = COLOR_VARIANT;
export const AUTH_TAGS = { LOGIN: 'login', REGISTER: 'register' } as const;
export const { LOGIN, REGISTER } = AUTH_TAGS;

export const INPUT_TYPES = {
  TEXT: 'text',
  PASSWORD: 'password',
  EMAIL: 'email',
  SEARCH: 'search',
  TEL: 'tel',
  URL: 'url',

  NUMBER: 'number',
  RANGE: 'range',

  DATE: 'date',
  DATETIME_LOCAL: 'datetime-local',
  MONTH: 'month',
  WEEK: 'week',
  TIME: 'time',

  CHECKBOX: 'checkbox',
  RADIO: 'radio',

  FILE: 'file',
  COLOR: 'color',
  HIDDEN: 'hidden',
} as const;
