import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Pagination } from '@ui';
import { appEvents } from '@utils';
import { ROUTE_CHANGE } from '@constants';

describe('Pagination', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();

    window.history.pushState({}, '', '/?page=1');
  });

  it('renders correct number of page buttons', () => {
    new Pagination({
      parentNode: root,
      totalPages: 5,
      currentPage: 1,
    });

    const buttons = root.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('navigates to next page', () => {
    new Pagination({
      parentNode: root,
      totalPages: 5,
      currentPage: 1,
    });

    const nextBtn = root.querySelector('button[aria-label="Next page"]')! as HTMLButtonElement;
    nextBtn.click();

    const url = new URL(window.location.href);
    expect(url.searchParams.get('page')).toBe('2');
  });

  it('navigates to previous page', () => {
    new Pagination({
      parentNode: root,
      totalPages: 5,
      currentPage: 3,
    });

    const prevBtn = root.querySelector('button[aria-label="Previous page"]')! as HTMLBRElement;
    prevBtn.click();

    const url = new URL(window.location.href);
    expect(url.searchParams.get('page')).toBe('2');
  });

  it('emits ROUTE_CHANGE on page click', () => {
    const spy = vi.spyOn(appEvents, 'emit');

    new Pagination({
      parentNode: root,
      totalPages: 5,
      currentPage: 1,
    });

    const pageBtn = [...root.querySelectorAll('button')].find((btn) => btn.textContent === '3')!;
    pageBtn.click();

    expect(spy).toHaveBeenCalledWith(ROUTE_CHANGE, '3');
  });

  it('updates page buttons on updateMeta', () => {
    const pagination = new Pagination({
      parentNode: root,
      totalPages: 5,
      currentPage: 1,
    });

    pagination.updateMeta(10, 5);

    const active = root.querySelector('.app-pagination_page--active');
    expect(active?.textContent).toBe('5');
  });

  it('updates current page on update()', () => {
    const pagination = new Pagination({
      parentNode: root,
      totalPages: 5,
      currentPage: 1,
    });

    pagination.update(4);

    const active = root.querySelector('.app-pagination_page--active');
    expect(active?.textContent).toBe('4');
  });

  it('rebuilds buttons on resize', () => {
    new Pagination({
      parentNode: root,
      totalPages: 10,
      currentPage: 5,
    });

    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));

    const buttons = root.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
