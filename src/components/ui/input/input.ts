import { Component } from '@components';
import { Button, GoogleIcon } from '@ui';
import type { GoogleIconsType, InputType } from '@types';
import { INPUT_TYPES } from '@constants';

const { PASSWORD, TEXT } = INPUT_TYPES;

type InputProps = {
  parentNode: HTMLElement;
  label: string;
  placeholder: string;
  type?: InputType;
  leftIcon?: GoogleIconsType;
  rightIcon?: GoogleIconsType;
  id: string;
  name: string;
  autocomplete?: string;
};

export class Input extends Component {
  private wrapNode!: HTMLElement;
  private inputNode!: Component;
  private errorNode!: Component;
  private rightIcon: Button | null = null;

  constructor({
    parentNode,
    label,
    placeholder,
    type = 'text',
    leftIcon,
    rightIcon,
    id,
    name,
    autocomplete,
  }: InputProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'app_input',
    });

    new Component({
      parentNode: this.node,
      tagName: 'label',
      className: 'app_input_label',
      attrs: [{ attr: 'for', value: id }],
      content: label,
    });

    const wrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'app_input_wrap',
    });
    this.wrapNode = wrap.node;

    this.inputNode = new Component({
      parentNode: this.wrapNode,
      tagName: 'input',
      className: [
        'app_input_field',
        leftIcon ? 'input-with-icon' : '',
        rightIcon ? 'input-right-icon' : '',
      ].filter(Boolean),
      attrs: [
        { attr: 'id', value: id },
        { attr: 'name', value: name },
        { attr: 'type', value: type },
        { attr: 'placeholder', value: placeholder },
        { attr: 'autocomplete', value: autocomplete ?? 'off' },
      ],
    });

    if (leftIcon) {
      new GoogleIcon({
        parentNode: wrap.node,
        iconName: leftIcon,
        iconClass: 'app_input_icon',
      });
    }

    if (type === PASSWORD && rightIcon) {
      this.rightIcon = new Button({
        parentNode: wrap.node,
        googleIcon: rightIcon,
        className: 'app_input_right-icon',
        variant: 'empty',
      });
      this.rightIcon.node.onclick = () => this.changePasswordVisibility();
    }

    this.errorNode = new Component({
      parentNode: this.node,
      tagName: 'span',
      className: 'app_input_error',
      content: '',
    });
  }

  public setError(text: string) {
    this.errorNode.node.textContent = text;

    if (text) {
      this.wrapNode.classList.add('has-error');
      this.errorNode.node.classList.add('visible');
    } else {
      this.wrapNode.classList.remove('has-error');
      this.errorNode.node.classList.remove('visible');
    }
  }

  public changePasswordVisibility() {
    const inputElement = this.inputNode.node as HTMLInputElement;
    if (inputElement.type === PASSWORD) {
      inputElement.type = TEXT;
      this.rightIcon?.setGoogleIcon('visibility');
    } else {
      inputElement.type = PASSWORD;
      this.rightIcon?.setGoogleIcon('visibility_off');
    }
  }

  public getInput() {
    return this.inputNode;
  }

  destroy(): void {
    this.rightIcon?.destroy();
    this.inputNode.node.onblur = null;
    this.inputNode.node.onfocus = null;
    super.destroy();
  }
}
