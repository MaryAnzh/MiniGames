import type { ColorVariantType, ComponentProps } from '@types';
import { arrayFromNumber } from '@utils';
import { Component } from 'src/components/component';
import { LIGHT } from '@constants';

type SkeletonTextProps = Pick<ComponentProps, 'parentNode'> & {
  columns?: number;
  rows?: number;
  variant?: 'one' | 'multi';
  className?: string;
  color?: ColorVariantType;
};

export class SkeletonText extends Component {
  constructor({
    parentNode,
    columns = 1,
    rows = 1,
    variant = 'one',
    className,
    color = LIGHT,
  }: SkeletonTextProps) {
    super({
      parentNode,
      tagName: 'div',
      className: ['app-skeleton-text', `app-skeleton-text_${variant}`, className ?? ''],
    });
    if (rows === 1 && columns === 1) {
      new Component({
        parentNode: this.node,
        tagName: 'div',
        className: ['app-skeleton-text_row_item', 'app-skeleton-text_skeleton'],
        attrs: [{ attr: 'data-color', value: color }],
      });
      return;
    }

    arrayFromNumber(rows).forEach(() => {
      const rowWrap = new Component({
        parentNode: this.node,
        tagName: 'div',
        className: 'app-skeleton-text_row',
      });

      arrayFromNumber(columns).forEach(() => {
        new Component({
          parentNode: rowWrap.node,
          tagName: 'span',
          className: ['app-skeleton-text_row_item', 'app-skeleton-text_skeleton'],
          attrs: [{ attr: 'data-color', value: color }],
        });
      });
    });
  }
}
