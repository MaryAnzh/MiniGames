import type { ICON_PICKER, COMPONENT_SIZES } from '@constants';
import type { KeysTemplateType } from './common';

export type ComponentAttributesType = {
  attr: string;
  value: string;
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
