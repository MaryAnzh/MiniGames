import { Component } from '@components';
import { Icon, LikeButton, Skeleton } from '@ui';
import type { CommentToggleResponseType, ComponentProps, GameCardItemType } from '@types';
import { LIGHT } from '@constants';
import { appStore } from '@store';

export type MetaSectionProps = Pick<ComponentProps, 'parentNode'> &
  Pick<GameCardItemType, 'likesCount' | 'rating'> & {
    isSkeleton?: boolean;
    isLikedByCurrentUser: boolean;
    onLike?: () => Promise<CommentToggleResponseType>;
  };

export class MetaSection extends Component {
  store: typeof appStore;
  isAuth: boolean;
  public likeButton?: LikeButton;

  constructor({
    parentNode,
    likesCount,
    rating,
    isSkeleton = false,
    onLike,
    isLikedByCurrentUser,
  }: MetaSectionProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'game-detail_meta',
    });

    this.store = appStore;
    this.isAuth = this.store.isAuth;

    this.render({ rating, likesCount, isSkeleton, onLike, isLikedByCurrentUser });
  }

  private render({
    rating,
    likesCount,
    isSkeleton,
    onLike,
    isLikedByCurrentUser,
  }: Omit<MetaSectionProps, 'parentNode'>) {
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
      return;
    }

    new Icon({
      parentNode: ratingWrap.node,
      icon: 'star',
    });

    new Component({
      parentNode: ratingWrap.node,
      tagName: 'span',
      content: rating.toFixed(1),
    });

    this.likeButton = new LikeButton({
      parentNode: likeWrap.node,
      variant: 'empty',
      value: likesCount,
      isIcon: true,
      isFavorite: isLikedByCurrentUser,
      disabled: !this.isAuth,
      callback: onLike,
    });
  }
}
