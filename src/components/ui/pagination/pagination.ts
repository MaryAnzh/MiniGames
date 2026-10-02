import { Component } from '@components';
import { Button } from '@ui';
import { appEvents, arrayFromNumber } from '@utils';
import { ROUTE_CHANGE } from '@constants';
import type { ComponentProps } from '@types';

type PaginationProps = Pick<ComponentProps, 'parentNode'> & {
  totalPages: number;
  currentPage?: number;
};

export class Pagination extends Component {
  private totalPages: number;
  private currentPage: number;

  private tabletWidth = 768;
  private isMobile = false;
  private maxVisible = 4;

  private windowStart = 1;

  private prevBtn!: Button;
  private nextBtn!: Button;
  private pageButtons: Button[] = [];

  constructor({ parentNode, totalPages, currentPage = 1 }: PaginationProps) {
    super({
      parentNode,
      tagName: 'nav',
      className: 'app-pagination',
      attrs: [{ attr: 'aria-label', value: 'Pagination' }],
    });

    this.totalPages = totalPages;
    this.currentPage = currentPage;

    this.isMobile = window.innerWidth < this.tabletWidth;
    this.maxVisible = this.isMobile ? 3 : 4;

    this.windowStart = this.calcInitialWindowStart();

    this.createButtons();
    this.updateStates();
    this.initResizeListener();
  }

  private calcInitialWindowStart(): number {
    if (this.totalPages <= this.maxVisible) return 1;

    const half = Math.floor(this.maxVisible / 2);
    let start = this.currentPage - half;

    if (start < 1) start = 1;
    if (start + this.maxVisible - 1 > this.totalPages) {
      start = this.totalPages - this.maxVisible + 1;
    }

    return start;
  }

  private createButtons() {
    this.prevBtn = new Button({
      parentNode: this.node,
      leftIcon: 'arrow_left',
      size: 'icon-md',
      color: 'light',
      corner: 'circle',
      ariaLabel: 'Previous page',
    });
    this.prevBtn.setAttributes([{ attr: 'role', value: 'pagination' }]);
    this.prevBtn.node.onclick = () => {
      if (this.currentPage > 1) this.updatePage(this.currentPage - 1, false);
    };

    const pages = this.getWindowPages();
    pages.forEach((page) => {
      const btn = new Button({
        parentNode: this.node,
        text: String(page),
        size: 'icon-md',
        corner: 'circle',
        ariaLabel: `Page ${page}`,
        color: this.currentPage === page ? 'dark' : 'light',
        className: this.currentPage === page ? 'app-pagination_page--active' : '',
      });

      btn.setAttributes([{ attr: 'role', value: 'pagination' }]);
      btn.node.onclick = () => this.updatePage(page, true);

      this.pageButtons.push(btn);
    });

    this.nextBtn = new Button({
      parentNode: this.node,
      leftIcon: 'arrow_right',
      size: 'icon-md',
      color: 'light',
      corner: 'circle',
      ariaLabel: 'Next page',
    });
    this.nextBtn.setAttributes([{ attr: 'role', value: 'pagination' }]);
    this.nextBtn.node.onclick = () => {
      if (this.currentPage < this.totalPages) this.updatePage(this.currentPage + 1, false);
    };
  }

  private updateStates() {
    this.prevBtn.setAttributes([
      { attr: 'disabled', value: this.currentPage === 1 ? 'true' : null },
    ]);

    this.nextBtn.setAttributes([
      { attr: 'disabled', value: this.currentPage === this.totalPages ? 'true' : null },
    ]);

    const pages = this.getWindowPages();

    this.pageButtons.forEach((btn, i) => {
      const page = pages[i];
      btn.setText(String(page));

      const active = page === this.currentPage;
      btn.node.classList.toggle('app-pagination_page--active', active);

      btn.setAttributes([{ attr: 'data-color', value: active ? 'dark' : 'light' }]);

      btn.node.onclick = () => this.updatePage(page, true);
    });
  }

  private updatePage(page: number, isPageClick: boolean) {
    const prevPage = this.currentPage;
    this.currentPage = page;

    if (!isPageClick) {
      this.handleArrowMove(prevPage, page);
    }

    const url = new URL(window.location.href);
    url.searchParams.set('page', String(page));
    window.history.pushState({}, '', url.toString());

    appEvents.emit(ROUTE_CHANGE, String(page));

    this.updateStates();
  }

  private handleArrowMove(prevPage: number, newPage: number) {
    const pages = this.getWindowPages();
    const first = pages[0];
    const last = pages[pages.length - 1];

    if (newPage < prevPage && prevPage === first) {
      this.windowStart = Math.max(1, this.windowStart - 1);
    }

    if (newPage > prevPage && prevPage === last) {
      this.windowStart = Math.min(this.totalPages - this.maxVisible + 1, this.windowStart + 1);
    }
  }

  private getWindowPages(): number[] {
    const count = Math.min(this.maxVisible, this.totalPages);
    return arrayFromNumber(count, this.windowStart);
  }

  private initResizeListener() {
    window.addEventListener('resize', () => {
      const nowMobile = window.innerWidth < this.tabletWidth;

      if (nowMobile === this.isMobile) return;

      this.isMobile = nowMobile;
      this.maxVisible = this.isMobile ? 3 : 4;

      this.windowStart = this.calcInitialWindowStart();

      this.rebuildPageButtons();
    });
  }

  private rebuildPageButtons() {
    this.node.innerHTML = '';
    this.pageButtons.forEach((btn) => btn.destroy());
    this.pageButtons = [];

    this.createButtons();
    this.updateStates();
  }

  public updateMeta(totalPages: number, currentPage: number) {
    this.totalPages = totalPages;
    this.currentPage = currentPage;

    this.windowStart = this.calcInitialWindowStart();
    this.rebuildPageButtons();
  }

  public update(page: number) {
    this.currentPage = page;
    this.updateStates();
  }
}
