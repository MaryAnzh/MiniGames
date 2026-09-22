import { Component } from '@components';
import type { ComponentProps } from '@types';
import { arrayFromNumber } from '@utils';

type SliderProps = Pick<ComponentProps, 'parentNode'>;

export class Slider extends Component {
  slidesCount = 5;
  slidesNode: HTMLElement[] = [];
  cardInfo = [
    { title: 'ISLANDERS: New Shores', stars: '4.9', likes: '54.2K' },
    { title: 'Vacation Cafe Simulator', stars: '4.8', likes: '28.7K' },
    { title: 'Winter Burrow', stars: '4.9', likes: '33.4K' },
  ];

  constructor({ parentNode }: SliderProps) {
    super({ parentNode, tagName: 'div', className: 'app_slider' });
    const sliderBody = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'app_slider_body',
    });

    arrayFromNumber(this.slidesCount).map((_, i) => {
      const slide = new Component({
        parentNode: sliderBody.node,
        tagName: 'div',
        className: 'app_slider_item',
      });

      if (i > 0 && i < 4) {
        const node = slide.node;
        const { title, stars, likes } = this.cardInfo.at(i - 1) ?? {
          title: '',
          likes: '',
          stars: '',
        };

        const infoWrap = new Component({
          parentNode: node,
          tagName: 'div',
          className: 'app_slider_item_info',
        });

        new Component({
          parentNode: infoWrap.node,
          tagName: 'h3',
          className: 'app_slider_item_title',
          content: title,
        });

        const starWrap = new Component({
          parentNode: infoWrap.node,
          tagName: 'span',
          className: 'app_slider_item_info_count',
        });

        const star = new Component({
          parentNode: starWrap.node,
          tagName: 'span',
          className: 'app_slider_item_star',
        });
        star.node.innerHTML = `<svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.85 14.825L10 12.925L13.15 14.85L12.325 11.25L15.1 8.85L11.45 8.525L10 5.125L8.55 8.5L4.9 8.825L7.675 11.25L6.85 14.825ZM3.825 19L5.45 11.975L0 7.25L7.2 6.625L10 0L12.8 6.625L20 7.25L14.55 11.975L16.175 19L10 15.275L3.825 19Z" fill="var(--primary, #FFD02B)"/>
</svg>`;

        new Component({
          parentNode: starWrap.node,
          tagName: 'span',
          content: stars,
        });

        const likeWrap = new Component({
          parentNode: infoWrap.node,
          tagName: 'span',
          className: 'app_slider_item_info_count',
        });

        const like = new Component({
          parentNode: likeWrap.node,
          tagName: 'span',
          className: 'app_slider_item_like',
        });
        like.node.innerHTML = `<svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 21L10.55 19.7C8.86667 18.1834 7.475 16.875 6.375 15.775C5.275 14.675 4.4 13.6917 3.75 12.825C3.1 11.9417 2.64167 11.1334 2.375 10.4C2.125 9.66669 2 8.91669 2 8.15002C2 6.58336 2.525 5.27502 3.575 4.22502C4.625 3.17502 5.93333 2.65002 7.5 2.65002C8.36667 2.65002 9.19167 2.83336 9.975 3.20002C10.7583 3.56669 11.4333 4.08336 12 4.75003C12.5667 4.08336 13.2417 3.56669 14.025 3.20002C14.8083 2.83336 15.6333 2.65002 16.5 2.65002C18.0667 2.65002 19.375 3.17502 20.425 4.22502C21.475 5.27502 22 6.58336 22 8.15002C22 8.91669 21.8667 9.66669 21.6 10.4C21.35 11.1334 20.9 11.9417 20.25 12.825C19.6 13.6917 18.725 14.675 17.625 15.775C16.525 16.875 15.1333 18.1834 13.45 19.7L12 21ZM12 18.3C13.6 16.8667 14.9167 15.6417 15.95 14.625C16.9833 13.5917 17.8 12.7 18.4 11.95C19 11.1834 19.4167 10.5084 19.65 9.92503C19.8833 9.32503 20 8.73336 20 8.15002C20 7.15002 19.6667 6.31669 19 5.65003C18.3333 4.98336 17.5 4.65003 16.5 4.65003C15.7167 4.65003 14.9917 4.87503 14.325 5.32503C13.6583 5.75836 13.2 6.31669 12.95 7.00003H11.05C10.8 6.31669 10.3417 5.75836 9.675 5.32503C9.00833 4.87503 8.28333 4.65003 7.5 4.65003C6.5 4.65003 5.66667 4.98336 5 5.65003C4.33333 6.31669 4 7.15002 4 8.15002C4 8.73336 4.11667 9.32503 4.35 9.92503C4.58333 10.5084 5 11.1834 5.6 11.95C6.2 12.7 7.01667 13.5917 8.05 14.625C9.08333 15.6417 10.4 16.8667 12 18.3Z"
                      fill="var(--like, #FF4B4B)"
                    />
                  </svg>`;

        new Component({
          parentNode: likeWrap.node,
          tagName: 'span',
          content: likes,
        });
      }

      this.slidesNode.push(slide.node);
    });
  }
}
