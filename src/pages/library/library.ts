import { Component } from '@components';
import type { ComponentProps, SortTypes } from '@types';
import { Pagination } from '@ui';
import appStore from '@store';
import { appEvents } from '@utils';

import { LibraryIntro, LibraryFilters, LibraryCards } from './sections';
import { ROUTE_CHANGE, SUCCESS } from '@constants';

export class LibraryPage extends Component {
  private store: typeof appStore;
  private cards!: LibraryCards;
  private pagination!: Pagination;
  public totalPage = 6;

  constructor({ parentNode }: Pick<ComponentProps, 'parentNode'>) {
    super({
      parentNode,
      tagName: 'div',
      className: 'library',
      attrs: [{ attr: 'id', value: 'page' }],
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

    const filters = new LibraryFilters({
      parentNode: this.node,
      categories: [],
      onCategoryChange: (categoryValue: string) => {
        this.store.currentCategory = categoryValue;
        const page = 1;
        this.loadGames(page);
        this.pagination.update(page);
      },
      onSortChange: (sortValue: SortTypes) => {
        this.store.currentSort = sortValue;
        const page = this.getPageFromURL();
        this.loadGames(page);
      },
    });

    this.cards = new LibraryCards({
      parentNode: this.node,
      list: [],
    });

    this.pagination = new Pagination({
      parentNode: this.node,
      // ToDo pagination
      totalPages: 1,
      currentPage: page,
    });

    this.store.getCategories().then((result) => {
      if (result.status === SUCCESS) {
        const categories = result.data.data;
        filters.updateCategories(categories);

        const defaultCategory = categories.find((c) => c.isDefault) ?? categories[0];
        this.store.currentCategory = defaultCategory.slug;

        const page = this.getPageFromURL();
        this.loadGames(page);
      }
    });
  }

  private updateCards(page: number) {
    this.cards.renderAllCards(this.gameList(page));
    this.pagination.update(page);
  }

  private async loadGames(page: number) {
    const result = await this.store.getGames({
      category: this.store.currentCategory,
      sort: this.store.currentSort,
      page,
      limit: this.store.pageLimit,
    });

    if (result.status === SUCCESS) {
      const list = result.data.data;
      this.cards.renderAllCards(list);
      this.pagination.update(page);
    } else {
      // ToDo toasts
    }
  }
}
