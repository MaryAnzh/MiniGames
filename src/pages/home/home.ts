import { Component } from '@components';
import type { ComponentProps } from '@types';
import { HeroSection } from './components/hero-section/hero-section';

type HomePageProps = Pick<ComponentProps, 'parentNode'>;

export class HomePage extends Component {
  constructor({ parentNode }: HomePageProps) {
    super({ parentNode, tagName: 'div', className: 'home-page' });
    new HeroSection({
      parentNode: this.node,
    });
  }
}
