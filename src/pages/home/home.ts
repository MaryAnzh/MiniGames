import { Component, Portal } from '@components';
import type { ComponentProps } from '@types';

import { HeroSection, SliderSection, GameDeveloperSection, TableSection } from './components';
import appStore from '@store';
import { EMPTY, ERROR, LOADING, SUCCESS } from '@constants';

type HomePageProps = Pick<ComponentProps, 'parentNode'> & { portal: Portal };

export class HomePage extends Component {
  private store: typeof appStore;
  private sliderSection: SliderSection;
  private tableSection: TableSection;
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

    this.tableSection = new TableSection({
      parentNode: this.node,
      status: LOADING,
      leaderBoard: [],
      onRetry: this.retryTableData,
    });

    const gameDev = new GameDeveloperSection({
      parentNode: this.node,
    });

    this.children = [heroSection, this.sliderSection, this.tableSection, gameDev];

    this.store.getGames({ featured: true }).then((result) => {
      const respStatus = result.status;
      if (respStatus === SUCCESS) {
        const games = result.data.data;
        this.sliderSection.updateSlides(games);
      }
      if (respStatus === ERROR) {
        this.sliderSection.updateSlides([], ERROR);
      }
    });
    this.store.getLeaderboard().then((result) => {
      const respStatus = result.status;

      if (respStatus === SUCCESS) {
        const data = result.data.data;
        this.tableSection.updateRows(data, data.length === 0 ? EMPTY : SUCCESS);
        return;
      }
      this.tableSection.updateRows([], respStatus);
    });
  }

  public onRetry = async () => {
    const result = await this.store.getGames({ featured: true });
    if (result.status === SUCCESS) {
      const games = result.data.data;
      this.sliderSection.updateSlides(games);
    } else {
      this.sliderSection.updateSlides([], result.status);
    }
  };

  public retryTableData = async () => {
    const result = await this.store.getLeaderboard();
    if (result.status === SUCCESS) {
      const leaders = result.data.data;
      this.tableSection.updateRows(leaders, SUCCESS);
    } else {
      this.tableSection.updateRows([], result.status);
    }
  };

  destroy(): void {
    this.children.forEach((ch) => ch.destroy());
    super.destroy();
  }
}
