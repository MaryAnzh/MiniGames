import { Component, Portal } from '@components';
import type { ComponentProps, GameCardDataType } from '@types';
import { Button } from '@ui';
import { GameDetailsDialog } from 'src/components/dialogs/game-details/game-details';

type LibraryCardsProps = Pick<ComponentProps, 'parentNode'> & {
  list: GameCardDataType[];
};

export class LibraryCards extends Component {
  private portal: Portal;

  constructor({ parentNode, list }: LibraryCardsProps) {
    super({
      parentNode,
      tagName: 'section',
      className: 'library_cards',
    });
    this.portal = new Portal({ position: 'top' });

    list.forEach((game, i) => {
      this.renderCard(game, i);
    });
  }

  private renderCard(game: GameCardDataType, i?: number) {
    const { cardImage, name, category, likesCount, price, rating, shortDescription } = game;
    const card = new Component({
      parentNode: this.node,
      tagName: 'article',
      className: 'library_game-card',
    });

    // IMAGE

    new Component({
      parentNode: card.node,
      tagName: 'img',
      className: 'library_game-card_img',
      attrs: [
        { attr: 'src', value: cardImage },
        { attr: 'alt', value: name },
      ],
    });

    // BODY
    const body = new Component({
      parentNode: card.node,
      tagName: 'div',
      className: 'library_game-card_body',
    });

    // HEADER
    const header = new Component({
      parentNode: body.node,
      tagName: 'div',
      className: 'library_game-card_header',
    });

    new Component({
      parentNode: header.node,
      tagName: 'h3',
      className: 'library_game-card_header_title',
      content: name,
      attrs: [{ attr: 'title', value: name }],
    });

    new Component({
      parentNode: header.node,
      tagName: 'span',
      className: 'library_game-card_header_category',
      content: category,
    });

    const priceSpan = (parentName: string) =>
      new Component({
        parentNode: null,
        tagName: 'span',
        className: `library_game-card_${parentName}_price`,
        content: price === 'free' ? 'free' : `${price}`,
      });

    header.node.append(priceSpan('header').node);

    // DESCRIPTION
    new Component({
      parentNode: body.node,
      tagName: 'p',
      className: 'library_game-card_desc',
      content: shortDescription,
    });

    // FOOTER
    const footer = new Component({
      parentNode: body.node,
      tagName: 'div',
      className: 'library_game-card_footer',
    });

    // rating
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

    // ratingWrap.node.insertAdjacentHTML(
    //   'beforeend',
    //   `<svg class="game-card_icon" width="24" height="24" viewBox="0 0 24 24">
    //       <path d="M8.85 17.825L12 15.925L15.15 17.85L14.325 14.25L17.1 11.85L13.45 11.525L12 8.125L10.55 11.5L6.9 11.825L9.675 14.25L8.85 17.825ZM5.825 22L7.45 14.975L2 10.25L9.2 9.625L12 3L14.8 9.625L22 10.25L16.55 14.975L18.175 22L12 18.275L5.825 22Z" fill="var(--primary)"/>
    //     </svg>`,
    // );
    new Component({
      parentNode: ratingWrap.node,
      tagName: 'span',
      className: 'library_game-card_footer_rating-value',
      content: rating.toFixed(1),
    });

    // likes
    const likesWrap = new Component({
      parentNode: footer.node,
      tagName: 'span',
      className: 'library_game-card_footer_likes',
    });
    new Button({
      parentNode: likesWrap.node,
      leftIcon: 'favorite',
      variant: 'empty',
      ariaLabel: 'Game likes',
    });

    new Component({
      parentNode: likesWrap.node,
      tagName: 'span',
      className: 'library_game-card_footer_likes-value',
      content: `${(likesCount / 1000).toFixed(1)}K`,
    });

    footer.append(priceSpan('footer').node);

    // DETAILS BUTTON
    const detailsBtn = new Button({
      parentNode: footer.node,
      text: 'Details',
      color: 'primary',
      size: 'md',
      className: 'library_game-card_footer_details',
      ariaLabel: `Details for ${name}`,
      fullWidth: true,
    });
    detailsBtn.node.onclick = () => this.openDetails(game);

    detailsBtn.setAttributes([{ attr: 'role', value: 'card-dialog' }]);
    if (i === 11) {
      this.openDetails(game);
    }
  }

  private openDetails(game: GameCardDataType) {
    const dialog = new GameDetailsDialog({
      parentNode: null,
      game,
      onClose: () => this.portal.unmount(),
    });

    this.portal.mount(dialog.node);
  }

  public renderAllCards(list: GameCardDataType[]) {
    this.node.innerHTML = '';
    list.forEach((game) => {
      this.renderCard(game);
    });
  }
}
