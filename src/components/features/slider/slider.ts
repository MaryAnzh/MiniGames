import { Component, Portal } from '@components';
import type { SliderProps } from './types';
import type { GameCardDataType, SlideCardType } from '@types';
import { Icon, LikeButton } from '@ui';
import { GameDetailsDialog } from 'src/components/dialogs/game-details/game-details';

export class Slider extends Component {
  private portal: Portal;

  slidesCount = 5;
  slidesNode: HTMLElement[] = [];
  games: GameCardDataType[] = [];
  visibleSlide = 5;

  constructor({ parentNode, slides }: SliderProps) {
    super({ parentNode, tagName: 'div', className: 'app_slider' });
    this.portal = new Portal();

    this.games = slides;
    this.render(slides);
  }

  private render(slides: GameCardDataType[]) {
    const sliderBody = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'app_slider_body',
    });

    const currentSlides = slides.slice(0, this.visibleSlide);
    currentSlides.map((game) => {
      const { name, cardImage, likesCount, rating } = game;

      const slide = new Component({
        parentNode: sliderBody.node,
        tagName: 'div',
        className: 'app_slider_body_item',
      });
      const node = slide.node;
      node.onclick = node.onclick = () => this.openDetails(game);

      // IMAGE
      new Component({
        parentNode: node,
        tagName: 'img',
        className: 'app_slider_body_item_img',
        attrs: [
          { attr: 'src', value: cardImage },
          { attr: 'alt', value: name },
        ],
      });

      // INFO
      const infoWrap = new Component({
        parentNode: node,
        tagName: 'div',
        className: 'app_slider_body_item_info',
      });

      //name
      new Component({
        parentNode: infoWrap.node,
        tagName: 'h3',
        className: 'app_slider_body_item_info_title',
        content: name,
      });

      const starWrap = new Component({
        parentNode: infoWrap.node,
        tagName: 'span',
        className: 'app_slider_body_item_info_count',
      });
      new Icon({ parentNode: starWrap.node, icon: 'star' });
      new Component({
        parentNode: starWrap.node,
        tagName: 'span',
        content: rating.toString(),
      });

      const likeWrap = new Component({
        parentNode: infoWrap.node,
        tagName: 'span',
        className: 'app_slider_body_item_info_count',
      });
      new LikeButton({ parentNode: likeWrap.node, isIcon: true, isLight: true });
      new Component({
        parentNode: likeWrap.node,
        tagName: 'span',
        content: likesCount.toString(),
      });

      this.slidesNode.push(slide.node);
    });
  }

  private openDetails(game: GameCardDataType) {
    const dialog = new GameDetailsDialog({
      parentNode: null,
      game,
      onClose: () => this.portal.unmount(),
    });

    this.portal.mount(dialog.node);
  }
}
