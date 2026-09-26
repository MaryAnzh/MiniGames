import { Component } from '@components';
import type { GameCardDataType } from '@types';
import { HeroSection } from './sections';

type GameDetailsProps = {
  parentNode: HTMLElement | null;
  game: GameCardDataType;
  onClose: () => void;
};

export class GameDetailsDialog extends Component {
  handleClose: () => void;

  constructor({ parentNode, game, onClose }: GameDetailsProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'app-game-details-dialog',
    });
    this.handleClose = onClose;

    this.render(game);
  }

  private render({ name, cardImage }: GameCardDataType) {
    new HeroSection({ parentNode: this.node, name, cardImage, onClose: this.handleClose });
  }
}
