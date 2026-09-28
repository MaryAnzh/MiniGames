import { Component } from '@components';
import type { ComponentProps } from '@types';

import { HeroSection, SliderSection, GameDeveloperSection, TableSection } from './components';
import appStore from '@store';

type HomePageProps = Pick<ComponentProps, 'parentNode'>;

export class HomePage extends Component {
  private store: typeof appStore;

  constructor({ parentNode }: HomePageProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'home-page',
      attrs: [{ attr: 'id', value: 'page' }],
    });
    this.store = appStore;
    new HeroSection({
      parentNode: this.node,
    });

    new SliderSection({
      parentNode: this.node,
      slides: this.store.games.filter((game) => game.featured),
    });

    new TableSection({
      parentNode: this.node,
    });

    new GameDeveloperSection({
      parentNode: this.node,
    });
  }
}
