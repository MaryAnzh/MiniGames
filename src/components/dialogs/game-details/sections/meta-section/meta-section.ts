import { Component } from '@components';
import { Button } from '@ui';
import type { ComponentProps, GameCardDataType } from '@types';

type MetaSectionProps = Pick<ComponentProps, 'parentNode'> & {
  game: GameCardDataType;
};

export class MetaSection extends Component {
  constructor({ parentNode, game }: MetaSectionProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'game-detail_meta',
    });

    this.render(game);
  }

  private render({ rating, likesCount }: GameCardDataType) {
    // rating
    const ratingWrap = new Component({
      parentNode: this.node,
      tagName: 'span',
      className: 'game-detail_meta_rating',
    });

    new Button({
      parentNode: ratingWrap.node,
      leftIcon: 'star',
      variant: 'empty',
      ariaLabel: 'Game stars',
    });

    new Component({
      parentNode: ratingWrap.node,
      tagName: 'span',
      content: rating.toFixed(1),
    });

    // likes
    const likesWrap = new Component({
      parentNode: this.node,
      tagName: 'span',
      className: 'game-detail_meta_likes',
    });

    new Button({
      parentNode: likesWrap.node,
      leftIcon: 'favorite',
      variant: 'empty',
      ariaLabel: 'Click if your like game',
    });

    new Component({
      parentNode: likesWrap.node,
      tagName: 'span',
      content: `${(likesCount / 1000).toFixed(1)}K`,
    });
  }
}
