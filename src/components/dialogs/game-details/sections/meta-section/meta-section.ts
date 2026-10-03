import { Component } from '@components';
import { Icon, LikeButton, Skeleton } from '@ui';
import type { ComponentProps, GameCardItemType } from '@types';
import { DARK } from '@constants';

type MetaSectionProps = Pick<ComponentProps, 'parentNode'> &
  Pick<GameCardItemType, 'likesCount' | 'rating'> & {
    isSkeleton?: boolean;
  };

export class MetaSection extends Component {
  constructor({ parentNode, likesCount, rating, isSkeleton = false }: MetaSectionProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'game-detail_meta',
    });
    this.render({ rating, likesCount, isSkeleton });
  }

  private render({ rating, likesCount, isSkeleton }: Omit<MetaSectionProps, 'parentNode'>) {
    const ratingWrap = new Component({
      parentNode: this.node,
      tagName: 'span',
      className: 'game-detail_meta_rating',
    });

    new Icon({
      parentNode: ratingWrap.node,
      icon: 'star',
    });

    new Component({
      parentNode: ratingWrap.node,
      tagName: 'span',
      content: isSkeleton ? '0' : rating.toFixed(1),
    });

    if (isSkeleton) {
      new Skeleton({
        parentNode: ratingWrap.node,
        color: DARK,
        className: 'game-detail_meta_rating-skeleton',
      });
    }

    const likesWrap = new Component({
      parentNode: this.node,
      tagName: 'span',
      className: 'game-detail_meta_likes',
    });

    new LikeButton({
      parentNode: likesWrap.node,
      variant: 'empty',
      value: likesCount,
      isIcon: true,
    });

    if (isSkeleton) {
      new Skeleton({
        parentNode: likesWrap.node,
        color: DARK,
        className: 'game-detail_meta_rating-skeleton',
      });
    }
  }
}
