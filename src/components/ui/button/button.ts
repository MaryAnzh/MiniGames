import type { ComponentProps, GoogleIconsType, IconPickerType } from '@types';
import { Component } from '../../component';
import { ICON_PICKER } from '@constants';
import { GoogleIcon } from '../google-icon/google-icon';
import { Skeleton } from '../skeleton/skeleton';

type ColorType = 'primary' | 'light' | 'dark' | 'ghost' | 'chips';

export type ButtonProps = Pick<ComponentProps, 'parentNode'> & {
  className?: string;
  variant?: 'solid' | 'empty' | 'skeleton';
  color?: ColorType;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon-sm' | 'icon-md' | 'icon-lg' | 'none';
  response?: 'sm' | 'md';
  corner?: 'sm' | 'sm-x' | 'md' | 'lg' | 'rounded' | 'circle';
  shadow?: 'none' | 'soft' | 'hard';

  text?: string;
  leftIcon?: IconPickerType;
  rightIcon?: IconPickerType;
  googleIcon?: GoogleIconsType;
  image?: string;

  fullWidth?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  isRoboto?: boolean;
  role?: string;
  type?: 'button' | 'submit';
};

export class Button extends Component {
  private textNode: Component | null = null;
  private googleIcon: GoogleIcon | null = null;

  constructor({
    parentNode,
    className,
    variant = 'solid',
    color,
    size,
    corner = 'sm',
    shadow = 'none',
    text,
    leftIcon,
    rightIcon,
    googleIcon,
    image,
    fullWidth,
    disabled,
    ariaLabel,
    response,
    isRoboto,
    role,
    type = 'button',
  }: ButtonProps) {
    super({
      parentNode,
      tagName: 'button',
      className: ['app_button', className ?? ''],
      attrs: [
        { attr: 'type', value: type },
        { attr: 'data-variant', value: variant },
        { attr: 'role', value: role ?? 'button' },
        { attr: 'data-shadow', value: shadow },
        color ? { attr: 'data-color', value: color } : null,
        { attr: 'data-shape', value: corner },
        fullWidth ? { attr: 'data-full', value: 'true' } : null,
        size && !response ? { attr: 'data-size', value: size } : null,
        response ? { attr: 'data-response', value: response } : null,
        disabled ? { attr: 'disabled', value: 'true' } : null,
        ariaLabel ? { attr: 'aria-label', value: ariaLabel } : null,
        isRoboto ? { attr: 'aria-font', value: 'true' } : null,
        rightIcon === 'arrow_down' ? { attr: 'data-dropdown', value: 'true' } : null,
      ].filter((el) => el !== null),
    });

    if (image) {
      new Component({
        parentNode: this.node,
        tagName: 'img',
        className: 'btn_img',
        attrs: [
          { attr: 'src', value: image },
          { attr: 'alt', value: ariaLabel ?? 'button image' },
        ],
      });
    }

    if (googleIcon) {
      this.googleIcon = new GoogleIcon({ parentNode: this.node, iconName: googleIcon });
    }

    if (leftIcon) {
      this.node.insertAdjacentHTML('beforeend', ICON_PICKER[leftIcon]);
      if (text) {
        this.renderTextNode(text);
      }
    }

    if (text && !this.textNode) {
      this.renderTextNode(text);
    }

    if (rightIcon) {
      this.node.insertAdjacentHTML('beforeend', ICON_PICKER[rightIcon]);
    }

    if (variant === 'skeleton') {
      new Skeleton({
        parentNode: this.node,
      });
    }
  }

  private renderTextNode(text: string) {
    this.textNode = new Component({
      parentNode: this.node,
      className: 'app_button_text',
      tagName: 'span',
      content: text,
    });
  }

  public setText(text: string) {
    if (this.textNode) {
      this.textNode.setContent(text);
    }
  }

  public setColor(color: ColorType) {
    this.setAttributes([{ attr: 'data-color', value: color }]);
  }

  public setDisabled(isDisabled: boolean) {
    this.setAttributes([{ attr: 'disabled', value: isDisabled ? 'true' : null }]);
  }

  public setGoogleIcon(iconName: GoogleIconsType) {
    if (this.googleIcon) {
      this.googleIcon.destroy();
    }
    this.googleIcon = this.googleIcon = new GoogleIcon({ parentNode: this.node, iconName });
  }

  destroy() {
    this.node.onclick = null;
    super.destroy();
  }
}
