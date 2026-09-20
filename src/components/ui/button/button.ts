import type { ComponentSizesType, IconPickerType } from '@types';
import { Component } from '../../component';
import { ICON_PICKER } from '@constants';
import { GoogleIcon } from '../google-icon/google-icon';

type ButtonProps = {
  parentNode: HTMLElement;
  colorVariant: 'dark' | 'light' | 'ghost' | 'ghost-light' | 'primary';
  variant?: 'base' | 'icon' | 'image' | 'round' | 'shadow';
  text?: string;
  className?: string;
  size?: ComponentSizesType | 'pop-up';
  icon?: IconPickerType;
  image?: string;
  isDisabled?: boolean;
  googleIcon?: 'arrow_back' | 'arrow_forward';
  radius?: 'lg';
  isRoboto?: boolean;
  width?: 'full';
  leftIcon?: IconPickerType;
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
    googleIcon,
    radius,
    leftIcon,
    isRoboto,
    width,
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
        radius ? `radius_${radius}` : '',
        isDisabled ? 'disabled_btn' : '',
        isRoboto ? 'roboto_btn' : '',
        width ? `${width}_btn` : '',
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

    if (googleIcon) {
      new GoogleIcon({ parentNode: this.node, iconName: googleIcon });
    }

    if (leftIcon) {
      const wrap = new Component({
        parentNode: null,
        tagName: 'span',
      });
      wrap.node.insertAdjacentHTML('beforeend', ICON_PICKER[leftIcon]);

      this.node.prepend(wrap.node);
    }
  }
}
