import { Component, Portal } from '@components';
import type { ComponentProps } from '@types';
import { Pagination } from '@ui';
import appStore from '@store';
import { appEvents } from '@utils';

import { LibraryIntro, LibraryFilters, LibraryCards } from './sections';
import { ROUTE_CHANGE } from '@constants';

type LibraryPageType = Pick<ComponentProps, 'parentNode'> & {
  portal: Portal;
};

export class LibraryPage extends Component {
  private store: typeof appStore;
  private cards!: LibraryCards;
  private pagination!: Pagination;
  private portal: Portal;

  constructor({ parentNode, portal }: LibraryPageType) {
    super({
      parentNode,
      tagName: 'div',
      className: 'library',
      attrs: [{ attr: 'id', value: 'page' }],
    });

    this.store = appStore;
    this.portal = portal;

    this.initListeners();
    this.renderPage();
  }

  private initListeners() {
    appEvents.on(ROUTE_CHANGE, (page) => {
      this.loadGames(Number(page));
    });

    window.addEventListener('popstate', () => {
      this.loadGames(this.getPageFromURL());
    });
  }

  private getPageFromURL(): number {
    const url = new URL(window.location.href);
    const page = Number(url.searchParams.get('page'));
    return page > 0 ? page : 1;
  }

  private renderPage() {
    const page = this.getPageFromURL();

    new LibraryIntro({ parentNode: this.node });

    const filters = new LibraryFilters({
      parentNode: this.node,
      categories: [],
      onCategoryChange: (value) => {
        this.store.currentCategory = value;
        this.loadGames(1);
        this.pagination.updateMeta(1, 1);
      },
      onSortChange: (value) => {
        this.store.currentSort = value;
        this.loadGames(1);
        this.pagination.updateMeta(1, 1);
      },
    });

    this.cards = new LibraryCards({
      parentNode: this.node,
      defaultCardCount: this.store.pageLimit,
      portal: this.portal,
    });

    this.pagination = new Pagination({
      parentNode: this.node,
      totalPages: 1,
      currentPage: page,
    });

    this.store.getCategories().then((result) => {
      if (result.status === 'success') {
        const categories = result.data.data;
        filters.updateCategories(categories);

        const def = categories.find((c) => c.isDefault) ?? categories[0];
        this.store.currentCategory = def.slug;

        this.loadGames(page);
      }
    });
  }

  private async loadGames(page: number) {
    this.cards.showSkeletons();

    const result = await this.store.getGames({
      category: this.store.currentCategory,
      sort: this.store.currentSort,
      page,
      limit: this.store.pageLimit,
    });

    if (result.status === 'success') {
      const { data, meta } = result.data;

      this.cards.renderAllCards(data);
      this.pagination.updateMeta(meta.totalPages, meta.page);

      if (!data.length) {
      }
    } else {
    }
  }
}
