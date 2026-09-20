import type { ComponentProps } from '@types';
import { Component } from 'src/components/component';

type GoogleIconProps = Pick<ComponentProps, 'parentNode'> & {
  iconName: string;
  iconClass?: string;
};

export class GoogleIcon extends Component {
  constructor({ parentNode, iconClass, iconName }: GoogleIconProps) {
    super({
      parentNode,
      className: ['google-icons', 'material-symbols-outlined', iconClass ?? ''],
      tagName: 'span',
      content: iconName,
    });
  }
}
