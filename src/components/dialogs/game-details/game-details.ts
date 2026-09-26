import { Component } from '@components';
import type { GameCardDataType } from '@types';
import { HeroSection, InfoSection, MetaSection } from './sections';

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

  private render(game: GameCardDataType) {
    const { name, cardImage, category, shortDescription } = game;

    new HeroSection({ parentNode: this.node, name, cardImage, onClose: this.handleClose });
    const bodyWrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'app-game-details-dialog_body-wrap',
    });
    new InfoSection({
      parentNode: bodyWrap.node,
      game,
    });
  }
}
