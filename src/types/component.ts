export type ComponentAttributesType = {
  atr: string;
  value: string;
};

export type ComponentProps = {
  parentNode: HTMLElement | null;
  tagName: keyof HTMLElementTagNameMap;
  className?: string | string[];
  content?: string | HTMLElement | (HTMLElement | string)[];
  attrs?: ComponentAttributesType[];
};
