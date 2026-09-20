import { Component } from '@components';
import type { ComponentProps } from '@types';
import { Button } from '@ui';

type GameDeveloperSectionProps = Pick<ComponentProps, 'parentNode'>;

export class GameDeveloperSection extends Component {
  constructor({ parentNode }: GameDeveloperSectionProps) {
    super({ parentNode, tagName: 'section', className: 'home-page_game-developer' });

    new Component({
      parentNode: this.node,
      tagName: 'img',
      className: 'game-developer_img',
      attrs: [
        { attr: 'src', value: '/img/game-developer.webp' },
        { attr: 'alt', value: 'game developer img' },
      ],
    });

    const info = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'game-developer_info',
    });

    new Component({
      parentNode: info.node,
      tagName: 'h2',
      className: 'game-developer_info_title',
      content: `Are You a Game Developer?`,
    });

    const text = new Component({
      parentNode: info.node,
      tagName: 'p',
      className: 'game-developer_info_text',
    });

    new Component({
      parentNode: text.node,
      tagName: 'span',
      content: `Want to see your game on MiniGames? We're always looking for fun,
engaging mini games to add to our platform. Submit your game`,
    });

    new Component({
      parentNode: text.node,
      tagName: 'span',
      content: `and reach thousands of players!`,
    });

    new Button({
      parentNode: info.node,
      colorVariant: 'primary',
      leftIcon: 'DOWNLOAD',
      size: 'sm',
      radius: 'lg',
      text: 'Submit Form',
      isRoboto: true,
      className: 'game-developer_button',
    });

    new Component({
      parentNode: info.node,
      tagName: 'p',
      className: 'game-developer_info_ps-text',
      content: 'or contact us at developers@minigames.com',
    });
  }
}
