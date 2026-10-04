import { Component, Portal } from '@components';
import type { ComponentProps } from '@types';

import { HeroSection, SliderSection, GameDeveloperSection, TableSection } from './components';
import appStore from '@store';
import { LOADING, SUCCESS } from '@constants';

type HomePageProps = Pick<ComponentProps, 'parentNode'> & { portal: Portal };

export class HomePage extends Component {
  private store: typeof appStore;
  private sliderSection: SliderSection;
  children: Component[] = [];

  constructor({ parentNode, portal }: HomePageProps) {
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

    this.sliderSection = new SliderSection({
      parentNode: this.node,
      slides: [],
      status: LOADING,
      portal,
      onRetry: this.onRetry,
    });

    const table = new TableSection({
      parentNode: this.node,
      status: LOADING,
      leaderBoard: [],
    });

    const gameDev = new GameDeveloperSection({
      parentNode: this.node,
    });

    this.children = [heroSection, this.sliderSection, table, gameDev];

    this.store.getGames({ featured: true }).then((result) => {
      if (result.status === SUCCESS) {
        const games = result.data.data;
        this.sliderSection.updateSlides(games);
      }
    });
    this.store.getLeaderboard().then((result) => {
      if (result.status === SUCCESS) {
        table.updateRows(result.data.data);
      }
    });
  }

  public onRetry = async () => {
    const result = await this.store.getGames({ featured: true });
    if (result.status === SUCCESS) {
      const games = result.data.data;
      this.sliderSection.updateSlides(games);
    } else {
      this.sliderSection.updateSlides([]);
    }
  };

  destroy(): void {
    this.children.forEach((ch) => ch.destroy());
    super.destroy();
  }
}
