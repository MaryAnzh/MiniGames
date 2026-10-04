import { Component } from '@components';
import { ICON_PICKER } from '@constants';
import type { ComponentProps, IconPickerType } from '@types';

type IconProps = Pick<ComponentProps, 'parentNode' | 'className'> & {
  icon: IconPickerType;
};

export class Icon extends Component {
  constructor({ parentNode, icon, className }: IconProps) {
    super({ parentNode, className });

    this.node.insertAdjacentHTML('beforeend', ICON_PICKER[icon]);
  }
}
