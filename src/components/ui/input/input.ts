import { Component } from '@components';
import { GoogleIcon } from '@ui';
import type { GoogleIconsType } from '@types';

type InputProps = {
  parentNode: HTMLElement;
  label: string;
  placeholder: string;
  type?: string;
  leftIcon?: GoogleIconsType;
  rightIcon?: GoogleIconsType;
  id: string;
  name: string;
  autocomplete?: string;
};

export class Input extends Component {
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

    new Component({
      parentNode: wrap.node,
      tagName: 'input',
      className: [
        'app_input_field',
        leftIcon ? 'input-with-icon' : '',
        rightIcon ? 'input-right-icon' : '',
      ],
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

    if (rightIcon) {
      new GoogleIcon({
        parentNode: wrap.node,
        iconName: rightIcon,
        iconClass: 'app_input_right-icon',
      });
    }
  }
}
