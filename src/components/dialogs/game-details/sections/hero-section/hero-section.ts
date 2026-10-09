import { Component } from '@components';
import type { ComponentProps, GameCardItemType } from '@types';
import { Button, Image } from '@ui';
import { CLOSE_BTN, GAME_IMAGE, LIGHT } from '@constants';

type HeroSectionProps = Pick<ComponentProps, 'parentNode'> &
  Pick<GameCardItemType, 'name' | 'cardImage'> & {
    onClose: () => void;
  };

export class HeroSection extends Component {
  handleClose: () => void;

  constructor({ parentNode, cardImage, onClose, name }: HeroSectionProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'game-detail_hero',
    });
    this.handleClose = onClose;
    this.render(cardImage, name);
  }

  private render(url: string, name: string) {
    new Image({
      parentNode: this.node,
      className: 'game-detail_hero_img',
      src: url.replace('.jpg', '.webp'),
      alt: `${GAME_IMAGE} ${name}`,
      skeletonColor: LIGHT,
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
    closeBtn.node.onclick = () => this.handleClose();
  }
}
