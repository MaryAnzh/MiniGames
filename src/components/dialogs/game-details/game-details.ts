import { Component } from '@components';
import type { GameCardDataType } from '@types';
import { CommentsSection, HeroSection, InfoSection, RecordsSection } from './sections';
import appStore from '@store';

type GameDetailsProps = {
  parentNode: HTMLElement | null;
  onClose: () => void;
  game?: GameCardDataType;
};

export class GameDetailsDialog extends Component {
  store: typeof appStore;
  handleClose: () => void;

  constructor({ parentNode, onClose, game }: GameDetailsProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'app-game-details-dialog',
    });
    this.store = appStore;
    this.handleClose = onClose;
    const g = game ?? this.store.games.at(11);
    this.render(g as GameCardDataType);
  }

  private render(game: GameCardDataType) {
    const { name, cardImage } = game;

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
    new RecordsSection({
      parentNode: bodyWrap.node,
      records: this.store.records,
    });
    new CommentsSection({ parentNode: this.node });
  }
}
