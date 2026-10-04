import { Component, Portal, GameDetailsDialog } from '@components';
import type { SliderProps } from './types';
import type { GameCardItemType, ResponseStatusType } from '@types';
import { Icon, Image, LikeButton, Skeleton } from '@ui';
import { SliderController } from './slider-controller';
import { EMPTY, ERROR, LIGHT, LOADING, SUCCESS } from '@constants';
import { arrayFromNumber, replaceImageToWebp } from '@utils';

export class Slider extends Component {
  private portal: Portal;
  private controller: SliderController;
  sliderBody: HTMLElement | null = null;
  slidesNode: HTMLElement[] = [];
  private isAnimating = false;
  private autoTimer: number | null = null;
  private restartTimer: number | null = null;
  private resizeTimer: number | null = null;
  // private isTimerOn = true;
  status: ResponseStatusType;

  constructor({ parentNode, slides, status, portal }: SliderProps) {
    super({ parentNode, tagName: 'div', className: 'app_slider' });
    this.portal = portal;
    this.status = status;
    const data =
      slides.length === 0
        ? arrayFromNumber(7).map(
            () =>
              ({
                cardImage: '',
                category: '',
                likesCount: 0,
                name: '*-----*',
                price: '',
                rating: 0,
                shortDescription: '',
                slug: '',
              }) as GameCardItemType,
          )
        : slides;

    this.controller = new SliderController({
      slides: data,
      onUpdateSlides: (visibleSlides) => {
        this.render(visibleSlides);
      },
    });
    window.addEventListener('resize', () => this.handleResize());

    // if (this.isTimerOn) {
    //   this.startAutoTimer();
    // }
  }

  private startAutoTimer() {
    this.autoTimer = window.setInterval(() => {
      if (!this.isAnimating) {
        this.animateNext();
      }
    }, 4000);
  }

  private stopAutoTimer() {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
  }

  private restartAutoTimerDelayed() {
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
    }

    this.restartTimer = window.setTimeout(() => {
      this.startAutoTimer();
      this.restartTimer = null;
    }, 10000);
  }

  private render(visibleSlides: GameCardItemType[]) {
    if (this.isAnimating) return;

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

  renderSlides(visibleSlides: GameCardItemType[]) {
    const body = this.sliderBody;
    if (!body) return;

    body.innerHTML = '';
    this.slidesNode = [];

    visibleSlides.forEach((game) => {
      const slide = new Component({
        parentNode: body,
        tagName: 'div',
        className: `app_slider_body_item`,
      });
      if (this.status === LOADING || this.status == ERROR) {
        new Skeleton({
          parentNode: slide.node,
          color: 'light',
        });
      }
      if (this.status === SUCCESS || this.status === EMPTY) {
        const { name, cardImage, likesCount, rating, slug } = game;

        const node = slide.node;
        node.onclick = () => this.openDetails(slug);

        new Image({
          parentNode: node,
          src: replaceImageToWebp(cardImage),
          alt: name,
          className: 'app_slider_body_item_img',
          skeletonColor: LIGHT,
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
        new LikeButton({
          parentNode: likeWrap.node,
          isIcon: true,
          isLight: true,
          value: likesCount,
        });

        this.slidesNode.push(slide.node);
      }
    });
  }

  private openDetails(slug: string) {
    const dialog = new GameDetailsDialog({
      parentNode: null,
      onClose: () => this.portal.unmount(),
      slug,
    });

    this.portal.mount(dialog.node);
  }

  private animate(direction: 'next' | 'prev') {
    if (this.isAnimating) return; // блокируем повторный вызов
    this.isAnimating = true;
    const plan = this.getAnimationPlan();
    if (!plan.length) {
      this.isAnimating = false;
      return;
    }

    let finishedCount = 0;

    plan.forEach((slidePlan) => {
      const { node, index, x: fromX, width: fromWidth } = slidePlan;

      const neighbor =
        direction === 'next'
          ? plan[(index + 1) % plan.length]
          : plan[(index - 1 + plan.length) % plan.length];

      const toX = neighbor.x;
      const toWidth = neighbor.width;

      const deltaX = direction === 'next' ? toX - fromX : toX - fromX; // ВСЕГДА влево

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
          duration: 350,
          easing: 'ease-in-out',
        },
      );

      animation.onfinish = () => {
        finishedCount++;

        if (finishedCount === plan.length) {
          direction === 'next' ? this.controller.next() : this.controller.prev();
        }
        this.isAnimating = false;
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

  private handleResize() {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }

    this.resizeTimer = window.setTimeout(() => {
      this.isAnimating = false;

      this.controller.updateVisibleCount();

      const visible = this.controller.getVisibleSlides();

      this.render(visible);

      this.getAnimationPlan();
    }, 150);
  }

  //PUBLIC
  public animateNext() {
    if (!this.isAnimating) {
      this.stopAutoTimer();
      this.restartAutoTimerDelayed();
      if (!this.isAnimating) this.animate('prev');
    }
  }

  public animatePrev() {
    if (!this.isAnimating) {
      this.stopAutoTimer();
      this.restartAutoTimerDelayed();
      if (!this.isAnimating) this.animate('next');
    }
  }

  //toDo
  destroy() {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
    }

    this.stopAutoTimer();

    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
    }
    super.destroy();
  }
}
