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
