import { Component } from 'src/components/component';
import type { ComponentProps, GameCardDataType } from '@types';
import { Button } from '@ui';
import { CLOSE_BTN, GAME_IMAGE } from '@constants';

type HeroSectionProps = Pick<ComponentProps, 'parentNode'> &
  Pick<GameCardDataType, 'name' | 'cardImage'> & {
    onClose: () => void;
  };

export class HeroSection extends Component {
  handleClose: () => void;

  constructor({ parentNode, cardImage, onClose }: HeroSectionProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'game-detail_hero',
    });
    this.handleClose = onClose;

    this.render(cardImage);
  }

  private render(url: string) {
    new Component({
      parentNode: this.node,
      tagName: 'img',
      className: 'game-detail_hero_img',
      attrs: [
        {
          attr: 'src',
          value: url,
        },
        { attr: 'alt', value: GAME_IMAGE },
      ],
    });

    const closeBtn = new Button({
      parentNode: this.node,
      color: 'light',
      corner: 'circle',
      className: 'game-detail_hero_close-btn',
      ariaLabel: CLOSE_BTN,
      leftIcon: 'close',
    });
    closeBtn.setAttributes([{ attr: 'role', value: CLOSE_BTN }]);
    closeBtn.node.onclick = this.handleClose;
  }
}
