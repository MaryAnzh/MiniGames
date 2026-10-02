import { Component, Portal } from '@components';
import type { ComponentProps, GameCardItemType } from '@types';
import { Button, Image, LikeButton, Skeleton, SkeletonText } from '@ui';
import { arrayFromNumber } from '@utils';
import { LIGHT } from '@constants';

import { EMPTY_CARD } from './constants';

type LibraryCardsProps = Pick<ComponentProps, 'parentNode'> & {
  defaultCardCount: number;
};

export class LibraryCards extends Component {
  private portal: Portal;
  private defaultCardCount: number;

  constructor({ parentNode, defaultCardCount }: LibraryCardsProps) {
    super({
      parentNode,
      tagName: 'section',
      className: 'library_cards',
    });

    this.portal = new Portal({ position: 'top' });
    this.defaultCardCount = defaultCardCount;

    this.renderSkeletons();
  }

  private renderSkeletons() {
    this.node.innerHTML = '';
    arrayFromNumber(this.defaultCardCount).forEach(() => this.renderCard(EMPTY_CARD));
  }

  private renderCard(game: GameCardItemType) {
    const { cardImage, name, category, likesCount, price, rating, shortDescription } = game;

    const card = new Component({
      parentNode: this.node,
      tagName: 'article',
      className: 'library_game-card',
    });

    new Image({
      parentNode: card.node,
      className: 'library_game-card_img',
      src: cardImage.replace('.jpg', '.webp'),
      alt: name,
      skeletonColor: LIGHT,
    });

    const body = new Component({
      parentNode: card.node,
      tagName: 'div',
      className: 'library_game-card_body',
    });

    const header = new Component({
      parentNode: body.node,
      tagName: 'div',
      className: 'library_game-card_header',
    });

    const title = new Component({
      parentNode: header.node,
      tagName: 'h3',
      className: 'library_game-card_header_title',
      content: name,
      attrs: [{ attr: 'title', value: name }],
    });

    if (!name) {
      new SkeletonText({ parentNode: title.node, columns: 2, variant: 'multi' });
    }

    const tag = new Component({
      parentNode: header.node,
      tagName: 'span',
      className: 'library_game-card_header_category',
      content: category,
    });

    if (!category) {
      new Skeleton({ parentNode: tag.node });
    }

    const priceSpan = (parentName: string) => {
      const pr = new Component({
        parentNode: null,
        tagName: 'span',
        className: `library_game-card_${parentName}_price`,
        content: price === 'free' ? 'free' : `${price}`,
      });

      if (likesCount === -1) {
        new Skeleton({ parentNode: pr.node });
      }

      return pr;
    };

    header.node.append(priceSpan('header').node);

    const desc = new Component({
      parentNode: body.node,
      tagName: 'p',
      className: 'library_game-card_desc',
      content: shortDescription,
    });

    if (!shortDescription) {
      new SkeletonText({
        parentNode: desc.node,
        variant: 'multi',
        rows: 2,
        columns: 3,
      });
    }

    const footer = new Component({
      parentNode: body.node,
      tagName: 'div',
      className: 'library_game-card_footer',
    });

    const ratingWrap = new Component({
      parentNode: footer.node,
      tagName: 'span',
      className: 'library_game-card_footer_rating',
    });

    new Button({
      parentNode: ratingWrap.node,
      leftIcon: 'star',
      variant: 'empty',
      ariaLabel: 'Game rating',
    });

    new Component({
      parentNode: ratingWrap.node,
      tagName: 'span',
      className: 'library_game-card_footer_rating-value',
      content: rating.toFixed(1),
    });

    if (rating === -1) {
      new Skeleton({ parentNode: ratingWrap.node });
    }

    const likesWrap = new Component({
      parentNode: footer.node,
      tagName: 'span',
      className: 'library_game-card_footer_likes',
    });

    new LikeButton({
      parentNode: likesWrap.node,
      variant: 'empty',
    });

    new Component({
      parentNode: likesWrap.node,
      tagName: 'span',
      className: 'library_game-card_footer_likes-value',
      content: likesCount !== -1 ? `${(likesCount / 1000).toFixed(1)}K` : '',
    });

    if (likesCount === -1) {
      new Skeleton({ parentNode: likesWrap.node });
    }

    footer.append(priceSpan('footer').node);

    const detailsBtn = new Button({
      parentNode: footer.node,
      text: 'Details',
      color: 'primary',
      size: 'md',
      className: 'library_game-card_footer_details',
      ariaLabel: `Details for ${name}`,
      fullWidth: true,
      variant: likesCount === -1 ? 'skeleton' : undefined,
    });

    detailsBtn.node.onclick = () => this.openDetails(game);
    detailsBtn.setAttributes([{ attr: 'role', value: 'card-dialog' }]);
  }

  private openDetails(game: GameCardItemType) {
    // const dialog = new GameDetailsDialog({
    //   parentNode: null,
    //   game,
    //   onClose: () => this.portal.unmount(),
    // });
    const mock = new Component({
      parentNode: null,
      tagName: 'p',
      content: `mock data gor ${game.name}`,
    });
    this.portal.mount(mock.node);
  }

  public renderAllCards(list: GameCardItemType[]) {
    this.node.innerHTML = '';
    list.forEach((game) => this.renderCard(game));
  }

  public showSkeletons() {
    this.renderSkeletons();
  }
}
