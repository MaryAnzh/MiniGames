import { Component, Portal } from '@components';
import type { SliderProps } from './types';
import type { GameCardDataType } from '@types';
import { Icon, LikeButton } from '@ui';
import { GameDetailsDialog } from 'src/components/dialogs/game-details/game-details';
import { SliderController } from './slider-controller';

export class Slider extends Component {
  private portal: Portal;
  private controller: SliderController;

  constructor({ parentNode, slides }: SliderProps) {
    super({ parentNode, tagName: 'div', className: 'app_slider' });

    this.portal = new Portal();

    this.controller = new SliderController({
      slides,
      onUpdateSlides: (visibleSlides) => {
        this.render(visibleSlides);
      },
    });

    this.render(this.controller.getVisibleSlides());
  }

  private render(visibleSlides: GameCardDataType[]) {
    this.node.innerHTML = '';

    const sliderBody = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'app_slider_body',
    });

    visibleSlides.forEach((game) => {
      const { name, cardImage, likesCount, rating } = game;

      const slide = new Component({
        parentNode: sliderBody.node,
        tagName: 'div',
        className: `app_slider_body_item`,
      });

      const node = slide.node;
      node.onclick = () => this.openDetails(game);

      new Component({
        parentNode: node,
        tagName: 'img',
        className: 'app_slider_body_item_img',
        attrs: [
          { attr: 'src', value: cardImage },
          { attr: 'alt', value: name },
        ],
      });

      const infoWrap = new Component({
        parentNode: node,
        tagName: 'div',
        className: 'app_slider_body_item_info',
      });

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
