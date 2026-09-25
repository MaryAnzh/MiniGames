import { Component, Portal } from '@components';
import appStore from '@state';
import type { ComponentProps, GameCardData } from '@types';
import { Button } from '@ui';

export class LibraryCards extends Component {
  private portal: Portal;
  private store: typeof appStore;

  constructor({ parentNode }: Pick<ComponentProps, 'parentNode'>) {
    super({
      parentNode,
      tagName: 'section',
      className: 'library_cards',
    });
    this.store = appStore;
    this.portal = new Portal({ position: 'top' });

    this.store.games.forEach((game) => {
      this.renderCard(game);
    });
  }

  private renderCard({
    cardImage,
    name,
    category,
    likesCount,
    price,
    rating,
    shortDescription,
  }: GameCardData) {
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

    ratingWrap.node.insertAdjacentHTML(
      'beforeend',
      `<svg class="game-card_icon" width="24" height="24" viewBox="0 0 24 24">
          <path d="M8.85 17.825L12 15.925L15.15 17.85L14.325 14.25L17.1 11.85L13.45 11.525L12 8.125L10.55 11.5L6.9 11.825L9.675 14.25L8.85 17.825ZM5.825 22L7.45 14.975L2 10.25L9.2 9.625L12 3L14.8 9.625L22 10.25L16.55 14.975L18.175 22L12 18.275L5.825 22Z" fill="var(--primary)"/>
        </svg>`,
    );

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

    likesWrap.node.insertAdjacentHTML(
      'beforeend',
      `<svg class="game-card_icon" width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 20.9999L10.55 19.6999C8.86667 18.1832 7.475 16.8749 6.375 15.7749C5.275 14.6749 4.4 13.6916 3.75 12.8249C3.1 11.9416 2.64167 11.1332 2.375 10.3999C2.125 9.66657 2 8.91657 2 8.1499C2 6.58324 2.525 5.2749 3.575 4.2249C4.625 3.1749 5.93333 2.6499 7.5 2.6499C8.36667 2.6499 9.19167 2.83324 9.975 3.1999C10.7583 3.56657 11.4333 4.08324 12 4.7499C12.5667 4.08324 13.2417 3.56657 14.025 3.1999C14.8083 2.83324 15.6333 2.6499 16.5 2.6499C18.0667 2.6499 19.375 3.1749 20.425 4.2249C21.475 5.2749 22 6.58324 22 8.1499C22 8.91657 21.8667 9.66657 21.6 10.3999C21.35 11.1332 20.9 11.9416 20.25 12.8249C19.6 13.6916 18.725 14.6749 17.625 15.7749C16.525 16.8749 15.1333 18.1832 13.45 19.6999L12 20.9999Z" fill="var(--like)"/>
        </svg>`,
    );

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

    detailsBtn.node.addEventListener('click', () => {
      this.openDetails(name, shortDescription);
    });
  }

  private openDetails(name: string, shortDescription: string) {
    const dialog = new Component({
      parentNode: null,
      tagName: 'div',
      className: 'app_game-details',
      content: `<h2>${name}</h2><p>${shortDescription}</p>`,
    });

    this.portal.mount(dialog.node);
  }
}
