import type { ColorVariantType, ComponentProps } from '@types';
import { arrayFromNumber } from '@utils';
import { Component } from 'src/components/component';
import { Skeleton } from '../skeleton/skeleton';
import { LIGHT } from '@constants';

type SkeletonTextProps = Pick<ComponentProps, 'parentNode'> & {
  columns: number;
  rows: number;
  variant: 'title' | 'text';
  className: string;
  color: ColorVariantType;
};

export class SkeletonText extends Component {
  constructor({
    parentNode,
    columns = 1,
    rows = 1,
    variant,
    className,
    color = LIGHT,
  }: SkeletonTextProps) {
    super({
      parentNode,
      tagName: 'div',
      className: ['app-skeleton-text', `app-skeleton-text_${variant}`, className ?? ''],
    });

    arrayFromNumber(rows).forEach(() => {
      const rowWrap = new Component({
        parentNode: this.node,
        tagName: 'div',
        className: 'app-skeleton-text_row',
      });

      arrayFromNumber(columns).forEach(() => {
        const item = new Component({
          parentNode: rowWrap.node,
          tagName: 'span',
          className: 'app-skeleton-text_row_item',
        });
        new Skeleton({ parentNode: item.node, color });
      });
    });
  }
}
