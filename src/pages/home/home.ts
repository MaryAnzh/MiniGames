import { Component } from '@components';
import type { ComponentProps } from '@types';

import { HeroSection, SliderSection, GameDeveloperSection, TableSection } from './components';

type HomePageProps = Pick<ComponentProps, 'parentNode'>;

export class HomePage extends Component {
  constructor({ parentNode }: HomePageProps) {
    super({ parentNode, tagName: 'div', className: 'home-page' });

    new HeroSection({
      parentNode: this.node,
    });

    new SliderSection({
      parentNode: this.node,
    });

    new TableSection({
      parentNode: this.node,
    });

    new GameDeveloperSection({
      parentNode: this.node,
    });
  }
}
