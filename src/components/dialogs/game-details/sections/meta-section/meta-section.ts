import { Component } from '@components';
import { Icon, LikeButton, Skeleton } from '@ui';
import type { ComponentProps, GameCardItemType } from '@types';
import { LIGHT } from '@constants';

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

    const likeWrap = new Component({
      parentNode: this.node,
      tagName: 'span',
      className: 'game-detail_meta_likes',
    });

    if (isSkeleton) {
      new Skeleton({
        parentNode: ratingWrap.node,
        color: LIGHT,
        className: 'game-detail_meta_rating-skeleton',
      });

      new Skeleton({
        parentNode: likeWrap.node,
        color: LIGHT,
        className: 'game-detail_meta_likes-skeleton',
      });
    } else {
      new Icon({
        parentNode: ratingWrap.node,
        icon: 'star',
      });

      new Component({
        parentNode: ratingWrap.node,
        tagName: 'span',
        content: rating.toFixed(1),
      });

      new LikeButton({
        parentNode: likeWrap.node,
        variant: 'empty',
        value: likesCount,
        isIcon: true,
      });
    }
  }
}
