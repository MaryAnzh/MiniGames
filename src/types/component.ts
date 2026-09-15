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
