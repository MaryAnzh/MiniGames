import type { ComponentSizesType, IconPickerType } from '@types';
import { Component } from '../../component';
import { ICON_PICKER } from '@constants';

type ButtonProps = {
  parentNode: HTMLElement;
  colorVariant: 'dark' | 'light' | 'ghost' | 'primary';
  variant?: 'base' | 'icon' | 'image';
  text?: string;
  className?: string;
  size?: ComponentSizesType;
  icon?: IconPickerType;
  image?: string;
  isDisabled?: boolean;
};

export class Button extends Component {
  constructor({
    parentNode,
    variant = 'base',
    colorVariant = 'light',
    size,
    icon,
    text,
    image,
    isDisabled,
    className,
  }: ButtonProps) {
    super({
      parentNode,
      tagName: 'button',
      className: [
        'app_button',
        className ?? '',
        `${variant}_btn`,
        `${colorVariant}_btn`,
        size ? `${size}_btn` : '',
        isDisabled ? 'disabled_btn' : '',
      ].filter((el) => el),
      content: text ?? '',
      attrs: isDisabled ? [{ attr: 'disabled', value: 'true' }] : undefined,
    });

    if (icon && variant === 'icon') {
      this.node.innerHTML = '';
      this.node.insertAdjacentHTML('beforeend', ICON_PICKER[icon]);
    }

    if (image && variant === 'image') {
      new Component({
        parentNode: this.node,
        tagName: 'img',
        className: 'btn_img',
        attrs: [
          { attr: 'src', value: image },
          { attr: 'alt', value: 'logo' },
        ],
      });
    }
  }
}
