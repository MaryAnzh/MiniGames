import { Component } from '@components';
import type { ComponentProps } from '@types';

type TournamentsPageProps = Pick<ComponentProps, 'parentNode'>;

export class TournamentsPage extends Component {
  constructor({ parentNode }: TournamentsPageProps) {
    super({
      parentNode,
      tagName: 'section',
      className: 'tournaments_page',
      content: 'Tournaments Page',
    });
  }

  destroy() {
    super.destroy();
  }
}
