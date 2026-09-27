export type KeysTemplateType<T extends Record<string, string>> = T[keyof T];
export type ALignType = 'left' | 'center' | 'right';
