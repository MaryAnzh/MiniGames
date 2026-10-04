import type { ColorVariantType, ComponentProps } from '@types';
import { Component } from '../../component';
import { LIGHT } from '@constants';

type SkeletonProps = Pick<ComponentProps, 'parentNode'> & {
  width?: string;
  height?: string;
  color?: ColorVariantType;
  className?: string;
};

export class Skeleton extends Component {
  constructor({ parentNode, width, height, color = LIGHT, className }: SkeletonProps) {
    super({
      parentNode,
      tagName: 'div',
      className: ['app-skeleton', className ?? ''],
      attrs: [
        width ? { attr: 'style', value: `width:${width}` } : null,
        height ? { attr: 'style', value: `height:${height}` } : null,
        { attr: 'data-color', value: color },
      ].filter((el) => el !== null),
    });
  }
}
