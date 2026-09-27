import { Component } from '@components';
import { ICON_PICKER } from '@constants';
import type { ComponentProps, IconPickerType } from '@types';

type IconProps = Pick<ComponentProps, 'parentNode'> & {
  icon: IconPickerType;
};

export class Icon extends Component {
  constructor({ parentNode, icon }: IconProps) {
    super({ parentNode });

    this.node.insertAdjacentHTML('beforeend', ICON_PICKER[icon]);
  }
}
