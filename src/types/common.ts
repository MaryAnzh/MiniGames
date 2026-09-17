export type KeysTemplateType<T extends Record<string, string>> = T[keyof T];
