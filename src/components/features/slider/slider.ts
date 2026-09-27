import { Component, Portal } from '@components';
import type { SliderProps } from './types';
import type { GameCardDataType } from '@types';
import { Icon, LikeButton } from '@ui';
import { GameDetailsDialog } from 'src/components/dialogs/game-details/game-details';
import { SliderController } from './slider-controller';

export class Slider extends Component {
  private portal: Portal;
  private controller: SliderController;
  sliderBody: HTMLElement | null = null;
  slidesNode: HTMLElement[] = [];

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
    this.sliderBody = null;
    this.slidesNode = [];

    const sliderBody = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'app_slider_body',
    });
    this.sliderBody = sliderBody.node;
    this.renderSlides(visibleSlides);
  }

  renderSlides(visibleSlides: GameCardDataType[]) {
    const body = this.sliderBody;
    if (!body) return;

    body.innerHTML = '';
    this.slidesNode = [];

    visibleSlides.forEach((game) => {
      const { name, cardImage, likesCount, rating } = game;

      const slide = new Component({
        parentNode: body,
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

  private animate(direction: 'next' | 'prev') {
    const plan = this.getAnimationPlan();
    if (!plan.length) return;

    let finishedCount = 0;

    plan.forEach((slidePlan) => {
      const { node, index, x: fromX, width: fromWidth } = slidePlan;

      const neighbor =
        direction === 'next'
          ? plan[(index + 1) % plan.length]
          : plan[(index - 1 + plan.length) % plan.length];

      const toX = neighbor.x;
      const toWidth = neighbor.width;

      const deltaX = direction === 'next' ? toX - fromX : fromX - toX;

      const animation = node.animate(
        [
          {
            transform: `translateX(0px)`,
            width: `${fromWidth}px`,
            transformOrigin: direction === 'prev' ? 'left' : 'right',
          },
          {
            transform: `translateX(${deltaX}px)`,
            width: `${toWidth}px`,
            transformOrigin: direction === 'prev' ? 'left' : 'right',
          },
        ],
        {
          duration: 1000,
          easing: 'ease-in-out',
        },
      );

      animation.onfinish = () => {
        finishedCount++;

        if (finishedCount === plan.length) {
          direction === 'next' ? this.controller.next() : this.controller.prev();
        }
      };
    });
  }

  private getAnimationPlan() {
    const data: { node: HTMLElement; index: number; x: number; width: number }[] = [];

    this.slidesNode.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();

      data.push({
        node: slide,
        index,
        x: rect.left,
        width: rect.width,
      });
    });

    return data;
  }

  public animateNext() {
    this.animate('next');
  }

  public animatePrev() {
    this.animate('prev');
  }
}
