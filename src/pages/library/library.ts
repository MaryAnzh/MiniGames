import { Component } from '@components';
import type { ComponentProps } from '@types';

type LibraryPageProps = Pick<ComponentProps, 'parentNode'>;

export class LibraryPage {
  constructor({ parentNode }: LibraryPageProps) {
    new Component({
      parentNode,
      tagName: 'section',
      className: 'library_page',
      content: 'Library Page',
    });
  }
}
