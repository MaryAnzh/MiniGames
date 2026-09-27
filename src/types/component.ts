import type { ICON_PICKER, COMPONENT_SIZES, COMPONENT_ALIGN, LOGIN, REGISTER } from '@constants';
import type { KeysTemplateType } from './common';

export type ComponentAttributesType = {
  attr: string;
  value: string | null;
};

export type ComponentProps = {
  parentNode: HTMLElement | null;
  tagName?: keyof HTMLElementTagNameMap | null;
  className?: string | string[];
  content?: string | HTMLElement | (HTMLElement | string)[];
  attrs?: ComponentAttributesType[];
};

export type IconPickerType = keyof typeof ICON_PICKER;
export type ComponentSizesType = KeysTemplateType<typeof COMPONENT_SIZES>;
export type AuthFormType = typeof LOGIN | typeof REGISTER;
export type AlignType = KeysTemplateType<typeof COMPONENT_ALIGN>;

export type GoogleIconsType =
  | 'mail'
  | 'lock'
  | 'visibility'
  | 'person'
  | 'arrow_back'
  | 'arrow_forward'
  | 'google'
  | 'share'
  | 'chat'
  | 'rss_feed'
  | 'close';
