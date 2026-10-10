import { Component } from '@components';
import { SUCCESS } from '@constants';
import appStore from '@store';
import type { GameComment, GameDetailsType } from '@types';

import { CommentsSection, HeroSection, InfoSection, RecordsSection } from './sections';

type GameDetailsProps = {
  parentNode: HTMLElement | null;
  onClose: () => void;
  slug: string;
  navigateTo: (path: string) => void;
};

export class GameDetailsDialog extends Component {
  store: typeof appStore;
  handleClose: () => void;
  slug: string;
  navigateTo: (path: string) => void;

  constructor({ parentNode, onClose, slug, navigateTo }: GameDetailsProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'app-game-details-dialog',
    });
    this.store = appStore;
    this.handleClose = onClose;
    this.slug = slug;
    this.navigateTo = navigateTo;

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
      specs: { genre: '', players: '', duration: '', price: '' },
      likesCount: 0,
      isLikedByCurrentUser: false,
      fullDescription: '',
      rating: 0,
      slug: this.slug,
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
      slug: this.slug,
      navigateTo: this.navigateTo,
    });
  }

  private render(game: GameDetailsType, comments: GameComment[]) {
    const {
      name,
      heroImage: cardImage,
      likesCount,
      rating,
      specs,
      fullDescription,
      topRecords: records,
      slug,
      isLikedByCurrentUser,
    } = game;

    new HeroSection({ parentNode: this.node, name, cardImage, onClose: this.handleClose });
    const bodyWrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'app-game-details-dialog_body-wrap',
    });
    new InfoSection({
      parentNode: bodyWrap.node,
      likesCount,
      rating,
      name,
      specs,
      fullDescription,
      slug,
      isLikedByCurrentUser,
    });
    new RecordsSection({
      parentNode: bodyWrap.node,
      records,
    });
    new CommentsSection({
      parentNode: this.node,
      comments,
      navigateTo: this.navigateTo,
      slug,
    });
  }

  private async loadData() {
    try {
      const [gameRes, commentsRes] = await Promise.all([
        appStore.getGameDetails(this.slug),
        appStore.getGameComments(this.slug, {
          limit: 10,
          sort: 'newest',
        }),
      ]);

      if (gameRes.status !== SUCCESS) {
        return;
      }

      const game = gameRes.data.data;
      const comments = commentsRes.status === SUCCESS ? commentsRes.data.data : [];
      this.node.replaceChildren();

      this.render(game, comments);
    } catch {
      // TODO: render error state
    }
  }
}
