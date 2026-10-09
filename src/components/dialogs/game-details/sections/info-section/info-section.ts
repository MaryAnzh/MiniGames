import { Component } from '@components';
import type { ComponentProps, GameCardDataType } from '@types';
import { MetaSection } from '../meta-section/meta-section';
import { Button, LikeButton, Skeleton, SkeletonText } from '@ui';
import { PLAY_NOW, LIGHT, SUCCESS } from '@constants';
import appStore from '@store';

type InfoType = Pick<
  GameCardDataType,
  | 'name'
  | 'shortDescription'
  | 'category'
  | 'duration'
  | 'players'
  | 'price'
  | 'likesCount'
  | 'rating'
>;

type InfoSectionProps = Pick<ComponentProps, 'parentNode'> &
  InfoType & {
    isSkeleton?: boolean;
  };

export class InfoSection extends Component {
  store: typeof appStore;
  info: InfoType;
  isFavorite: boolean = false;
  private smallLikeButton?: LikeButton;
  private bigLikeButton?: LikeButton;

  constructor({
    parentNode,
    category,
    duration,
    name,
    players,
    price,
    shortDescription,
    rating,
    likesCount,
    isSkeleton = false,
  }: InfoSectionProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'game-detail_info',
    });

    this.info = { category, duration, name, players, price, shortDescription, rating, likesCount };
    this.store = appStore;

    this.render(this.info, isSkeleton);
  }

  private render(info: InfoType, isSkeleton: boolean) {
    const { name, shortDescription, category, duration, players, price, rating, likesCount } = info;

    const titleWrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'game-detail_info_title-wrap',
    });

    if (isSkeleton) {
      new SkeletonText({
        parentNode: titleWrap.node,
        rows: 1,
        columns: 2,
        variant: 'multi',
        color: LIGHT,
        className: 'game-detail_info_title-skeleton',
      });
    } else {
      new Component({
        parentNode: titleWrap.node,
        tagName: 'h2',
        className: 'game-detail_info_title-wrap_title',
        content: name,
      });
    }

    const meta = new MetaSection({
      parentNode: titleWrap.node,
      rating,
      likesCount,
      isSkeleton,
      onLike: this.handleLike,
    });
    this.smallLikeButton = meta.likeButton;

    if (isSkeleton) {
      new SkeletonText({
        parentNode: this.node,
        rows: 4,
        columns: 3,
        variant: 'multi',
        color: LIGHT,
        className: 'game-detail_info_desc-skeleton',
      });
    } else {
      new Component({
        parentNode: this.node,
        tagName: 'p',
        className: 'game-detail_info_desc',
        content: shortDescription,
      });
    }

    const widgets = [
      { key: 'Genre', value: category },
      { key: 'Players', value: players },
      { key: 'Duration', value: duration },
      { key: 'Price', value: price },
    ];

    const widgetWrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'game-detail_info_widgets-wrap',
    });

    if (isSkeleton) {
      widgets.forEach(() => {
        new Skeleton({
          parentNode: widgetWrap.node,
          color: LIGHT,
          className: 'game-detail_info_widget-skeleton',
        });
      });
    } else {
      widgets.forEach(({ key, value }) => {
        const tag = new Component({
          parentNode: widgetWrap.node,
          tagName: 'div',
          className: 'game-detail_info_widgets-wrap_widget',
        });

        new Component({
          parentNode: tag.node,
          tagName: 'span',
          content: key,
          className: 'game-detail_info_widgets-wrap_widget_title',
        });

        new Component({
          parentNode: tag.node,
          tagName: 'span',
          content: value,
          className: 'game-detail_info_widgets-wrap_widget_value',
        });
      });
    }

    const actionsWrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'game-detail_info_actions-wrap',
    });

    if (isSkeleton) {
      new Skeleton({
        parentNode: actionsWrap.node,
        className: 'game-detail_info_actions-skeleton',
        color: LIGHT,
      });
      new Skeleton({
        parentNode: actionsWrap.node,
        className: 'game-detail_info_actions-skeleton',
        color: LIGHT,
      });
    } else {
      const playNowBtn = new Button({
        parentNode: actionsWrap.node,
        color: 'primary',
        size: 'lg',
        shadow: 'hard',
        text: PLAY_NOW,
        fullWidth: true,
        corner: 'sm-x',
        ariaLabel: PLAY_NOW,
      });

      playNowBtn.setAttributes([
        { attr: 'role', value: 'button' },
        { attr: 'aria-label', value: PLAY_NOW },
        { attr: 'tabindex', value: '0' },
      ]);

      this.bigLikeButton = new LikeButton({
        parentNode: actionsWrap.node,
        shadow: 'hard',
        className: 'game-detail_info_actions-wrap_like-desktop',
        corner: 'sm-x',
        withText: true,
        fullWidth: true,
        size: 'lg',
        isFavorite: this.isFavorite,
        callback: this.handleLike,
        disabled: !this.store.isAuth,
      });
    }
  }

  handleLike = async () => {
    this.smallLikeButton?.setLoading(true);
    this.bigLikeButton?.setLoading(true);

    const res = await this.store.toggleFavorite(appStore.routeParams.id);

    if (res.status !== SUCCESS) {
      const fallback = {
        isLiked: this.isFavorite,
        likesCount: this.info.likesCount,
      };

      this.smallLikeButton?.setLiked(fallback.isLiked);
      this.smallLikeButton?.setCount(fallback.likesCount);
      this.bigLikeButton?.setLiked(fallback.isLiked);

      this.smallLikeButton?.setLoading(false);
      this.bigLikeButton?.setLoading(false);

      this.store.showSnack('Error when send like', 'error');

      return fallback;
    }

    const { isFavorited, likesCount } = res.data.data;

    this.isFavorite = isFavorited;
    this.info.likesCount = likesCount;

    this.smallLikeButton?.setLiked(isFavorited);
    this.smallLikeButton?.setCount(likesCount);
    this.bigLikeButton?.setLiked(isFavorited);

    this.smallLikeButton?.setLoading(false);
    this.bigLikeButton?.setLoading(false);

    this.store.showSnack('Your like send!!!', 'success');

    return { isLiked: isFavorited, likesCount };
  };
}
