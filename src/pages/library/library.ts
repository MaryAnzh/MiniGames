import { Component } from '@components';
import type { ComponentProps } from '@types';
import { Pagination } from '@ui';
import appStore from '@state';
import { appEvents } from '@utils';

import { LibraryIntro, LibraryFilters, LibraryCards } from './sections';
import { ROUTE_CHANGE } from '@constants';

export class LibraryPage extends Component {
  private store: typeof appStore;
  private cards!: LibraryCards;
  private pagination!: Pagination;
  //for pagination check, your can add 4 forename
  public totalPage = 16;

  constructor({ parentNode }: Pick<ComponentProps, 'parentNode'>) {
    super({
      parentNode,
      tagName: 'div',
      className: 'library',
    });

    this.store = appStore;

    this.initListeners();
    this.renderPage();
  }

  private initListeners() {
    appEvents.on(ROUTE_CHANGE, (page) => {
      this.updateCards(Number(page));
    });

    window.addEventListener('popstate', () => {
      const page = this.getPageFromURL();
      this.updateCards(page);
    });
  }

  private getPageFromURL(): number {
    const url = new URL(window.location.href);
    const page = Number(url.searchParams.get('page'));
    return page > 0 ? page : 1;
  }

  private gameList(page: number) {
    const games = [...this.store.games];
    const start = (page - 1) * this.totalPage;
    const end = start + this.totalPage;
    const data = games.slice(start, end);
    return data;
  }

  private renderPage() {
    const page = this.getPageFromURL();

    new LibraryIntro({ parentNode: this.node });
    new LibraryFilters({ parentNode: this.node });

    this.cards = new LibraryCards({
      parentNode: this.node,
      list: this.gameList(page),
    });

    this.pagination = new Pagination({
      parentNode: this.node,
      totalPages: Math.ceil(this.store.games.length / this.totalPage),
      currentPage: page,
    });
  }

  private updateCards(page: number) {
    this.cards.renderAllCards(this.gameList(page));
    this.pagination.update(page);
  }
}
