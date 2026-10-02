import { Component } from '@components';
import type { ComponentProps } from '@types';

import { HeroSection, SliderSection, GameDeveloperSection, TableSection } from './components';
import appStore from '@store';
import { LOADING, SUCCESS } from '@constants';

type HomePageProps = Pick<ComponentProps, 'parentNode'>;

export class HomePage extends Component {
  private store: typeof appStore;
  children: Component[] = [];

  constructor({ parentNode }: HomePageProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'home-page',
      attrs: [{ attr: 'id', value: 'page' }],
    });
    this.store = appStore;

    const heroSection = new HeroSection({
      parentNode: this.node,
    });

    const sliderSection = new SliderSection({
      parentNode: this.node,
      slides: [],
      status: LOADING,
    });

    const table = new TableSection({
      parentNode: this.node,
      status: LOADING,
      leaderBoard: [],
    });

    const gameDev = new GameDeveloperSection({
      parentNode: this.node,
    });

    this.children = [heroSection, sliderSection, table, gameDev];

    this.store.getGames({ featured: true }).then((result) => {
      if (result.status === SUCCESS) {
        sliderSection.updateSlides(result.data.data);
      }
    });
    this.store.getLeaderboard().then((result) => {
      if (result.status === SUCCESS) {
        table.updateRows(result.data.data);
      }
    });
  }

  destroy(): void {
    this.children.forEach((ch) => ch.destroy());
    super.destroy();
  }
}
