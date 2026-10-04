import { Component } from '@components';
import type { GameComment, GameDetailsType } from '@types';
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

    this.renderSkeleton();
    this.loadData();
  }

  private renderSkeleton() {
    const parentNode = this.node;
    new HeroSection({ parentNode, cardImage: '', name: '', onClose: this.handleClose });
    const bodyWrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'app-game-details-dialog_body-wrap',
    });
    new InfoSection({
      parentNode: bodyWrap.node,
      isSkeleton: true,
      name: '',
      category: '',
      duration: '',
      players: '',
      price: '',
      shortDescription: '',
      rating: 0,
      likesCount: 0,
    });
    new RecordsSection({
      parentNode: bodyWrap.node,
      isSkeleton: true,
      records: [],
    });
    new CommentsSection({
      parentNode: bodyWrap.node,
      comments: [],
      isSkeleton: true,
    });
  }

  private render(game: GameDetailsType, comments: GameComment[]) {
    const {
      name,
      heroImage: cardImage,
      likesCount,
      rating,
      specs: { players, duration, price, genre: category },
      fullDescription: shortDescription,
    } = game;

    new HeroSection({ parentNode: this.node, name, cardImage, onClose: this.handleClose });
    const bodyWrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'app-game-details-dialog_body-wrap',
    });
    new InfoSection({
      parentNode: bodyWrap.node,
      category,
      likesCount,
      rating,
      duration,
      name,
      players,
      price,
      shortDescription,
    });
    new RecordsSection({
      parentNode: bodyWrap.node,
      records: this.store.records,
    });
    new CommentsSection({ parentNode: this.node, comments });
  }

  private async loadData() {
    try {
      const [gameRes, commentsRes] = await Promise.all([
        appStore.getGameDetails(this.slug),
        appStore.getGameComments(this.slug, {
          limit: 10,
          sort: 'newest',
          userEmail: this.store.userEmail,
        }),
      ]);

      if (gameRes.status !== SUCCESS) {
        // TODO: render error state
        return;
      }

      const game = gameRes.data.data;

      const comments = commentsRes.status === SUCCESS ? commentsRes.data.data : [];

      this.node.innerHTML = '';

      this.render(game, comments);
    } catch {
      // TODO: render error state
    }
  }
}
