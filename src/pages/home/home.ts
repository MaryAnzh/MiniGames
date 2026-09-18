import { Component } from '@components';
import type { ComponentProps } from '@types';
import { HeroSection } from './components/hero-section/hero-section';
import { SliderSection } from './components/slider-section/slider-section';
import { GameDeveloperSection } from './components/game-developer/game-developer';

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

    new GameDeveloperSection({
      parentNode: this.node,
    });
  }
}
