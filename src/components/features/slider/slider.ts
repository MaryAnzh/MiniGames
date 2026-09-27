import { Component } from '@components';
import { arrayFromNumber } from '@utils';
import type { SliderProps } from './types';
import type { SlideCardType } from '@types';
import { Icon, LikeButton } from '@ui';

export class Slider extends Component {
  slidesCount = 5;
  slidesNode: HTMLElement[] = [];
  slidesData: SlideCardType[] = [];
  visibleSlide = 5;

  constructor({ parentNode, slides }: SliderProps) {
    super({ parentNode, tagName: 'div', className: 'app_slider' });

    this.slidesData = slides;
    this.render(slides);
  }

  private render(slides: SlideCardType[]) {
    const sliderBody = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'app_slider_body',
    });

    const currentSlides = slides.slice(0, this.visibleSlide);
    currentSlides.map(({ name, cardImage, likesCount, rating }, i) => {
      const slide = new Component({
        parentNode: sliderBody.node,
        tagName: 'div',
        className: 'app_slider_body_item',
      });
      const node = slide.node;

      // IMAGE
      new Component({
        parentNode: node,
        tagName: 'img',
        className: 'app_slider_body_item_img',
        attrs: [
          { attr: 'src', value: cardImage },
          { atr: 'alt', value: name },
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
}
