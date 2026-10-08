import { Component } from '@components';
import type { ComponentProps, GameCardItemType, ResponseStatusType } from '@types';

import { HeroSection, SliderSection, GameDeveloperSection, TableSection } from './components';
import appStore from '@store';
import { APP_ROUTES, EMPTY, ERROR, LOADING, SUCCESS } from '@constants';

type HomePageProps = Pick<ComponentProps, 'parentNode'> & { navigate: (path: string) => void };

export class HomePage extends Component {
  private store: typeof appStore;
  private sliderSection: SliderSection;
  private tableSection: TableSection;
  private navigate: (path: string) => void;
  children: Component[] = [];

  constructor({ parentNode, navigate }: HomePageProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'home-page',
      attrs: [{ attr: 'id', value: 'page' }],
    });
    this.store = appStore;
    this.navigate = navigate;

    const heroSection = new HeroSection({
      parentNode: this.node,
    });

    this.sliderSection = new SliderSection({
      parentNode: this.node,
      onRetry: this.onRetry,
      openDetails: this.openDetails,
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
        this.renderSlider(games, games.length === 0 ? EMPTY : SUCCESS);
      }
      if (respStatus === ERROR) {
        this.renderSlider([], ERROR);
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
      this.renderSlider(games, games.length === 0 ? EMPTY : SUCCESS);
    } else {
      this.renderSlider([], result.status);
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

  private renderSlider(games: GameCardItemType[], status: ResponseStatusType) {
    this.sliderSection.updateSlides(games, status);
  }

  public openDetails = (slug: string) => {
    const gamePath = APP_ROUTES.GAME + slug;
    this.store.currentRoute = gamePath;
    this.navigate(gamePath);
  };

  destroy(): void {
    this.children.forEach((ch) => ch.destroy());
    super.destroy();
  }
}
