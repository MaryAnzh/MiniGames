import { Component } from '@components';
import type { ComponentProps } from '@types';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerColor = 'primary' | 'dark' | 'light';

type SpinnerProps = Pick<ComponentProps, 'parentNode'> & {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
};

export class Spinner extends Component {
  constructor({ parentNode, size = 'md', color = 'primary', className }: SpinnerProps) {
    super({
      parentNode,
      tagName: 'div',
      className: ['app-spinner', className ?? ''],
      attrs: [
        { attr: 'data-size', value: size },
        { attr: 'data-color', value: color },
      ],
    });
  }
}
