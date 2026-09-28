import { Component } from '@components';
import type { ComponentProps } from '@types';

type NotFoundPageProps = Pick<ComponentProps, 'parentNode'>;

export class NotFoundPage extends Component {
  constructor({ parentNode }: NotFoundPageProps) {
    super({ parentNode, tagName: 'div', className: 'app-not-found', content: 'Page not found' });
  }
}
