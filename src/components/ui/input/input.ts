import { Component } from '@components';
import { GoogleIcon } from '../google-icon/google-icon';
import type { GoogleIconsType } from '@types';

type InputProps = {
  parentNode: HTMLElement;
  label: string;
  placeholder: string;
  type?: string;
  icon?: GoogleIconsType;
  rightIcon?: GoogleIconsType;
};

export class Input extends Component {
  constructor({ parentNode, label, placeholder, type = 'text', icon, rightIcon }: InputProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'app_input',
    });

    new Component({
      parentNode: this.node,
      tagName: 'label',
      className: 'app_input_label',
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
        icon ? 'input-with-icon' : '',
        rightIcon ? 'input-right-icon' : '',
      ],
      attrs: [
        { attr: 'type', value: type },
        { attr: 'placeholder', value: placeholder },
      ],
    });

    if (icon) {
      new GoogleIcon({
        parentNode: wrap.node,
        iconName: icon,
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
