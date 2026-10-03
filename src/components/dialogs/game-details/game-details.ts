import { Component } from '@components';
import type { GameCardDataType } from '@types';
import { CommentsSection, HeroSection, InfoSection, RecordsSection } from './sections';
import appStore from '@store';
import { SUCCESS } from '@constants';

type GameDetailsProps = {
  parentNode: HTMLElement | null;
  onClose: () => void;
  slug: string;
};

export class GameDetailsDialog extends Component {
  store: typeof appStore;
  handleClose: () => void;
  slug: string;

  constructor({ parentNode, onClose, slug }: GameDetailsProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'app-game-details-dialog',
    });
    this.store = appStore;
    this.handleClose = onClose;
    this.slug = slug;

    const g = this.store.games.at(11);
    this.render(g as GameCardDataType);
    this.renderSkeleton();

    this.loadData();
  }

  private render(game: GameCardDataType) {
    const { name, cardImage } = game;

    new HeroSection({ parentNode: this.node, name, cardImage, onClose: this.handleClose });
    const bodyWrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'app-game-details-dialog_body-wrap',
    });
    // new InfoSection({
    //   parentNode: bodyWrap.node,
    //   category,

    // });
    new RecordsSection({
      parentNode: bodyWrap.node,
      records: this.store.records,
    });
    new CommentsSection({ parentNode: this.node });
  }

  private renderSkeleton() {
    new HeroSection({ parentNode: this.node, cardImage: '', name: '', onClose: this.handleClose });
    new InfoSection({
      parentNode: this.node,
      isSkeleton: true,
      name: '',
      category: '',
      duration: '',
      players: '',
      price: '',
      shortDescription: '',
      rating: -1,
      likesCount: -1,
    });
  }

  private async loadData() {
    const result = await appStore.getGameDetails(this.slug);
    if (result.status === SUCCESS) {
      return result.data.data;
    }
  }
}
