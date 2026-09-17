import { Component } from '@components';
import type { ComponentProps } from '@types';

type TournamentsPageProps = Pick<ComponentProps, 'parentNode'>;

export class TournamentsPage {
  constructor({ parentNode }: TournamentsPageProps) {
    new Component({
      parentNode,
      tagName: 'section',
      className: 'tournaments_page',
      content: 'Tournaments Page',
    });
  }
}
