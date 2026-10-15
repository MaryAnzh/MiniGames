import { Component } from '@components';
import { APP_ROUTES } from '@constants';
import type { ComponentProps } from '@types';
import { Button } from '@ui';

type NotFoundPageProps = Pick<ComponentProps, 'parentNode'> & {
  navigate?: (path: string) => void;
};

export class NotFoundPage extends Component {
  constructor({ parentNode, navigate }: NotFoundPageProps) {
    super({ parentNode, tagName: 'div', className: 'app-not-found' });
    new Component({
      parentNode: this.node,
      tagName: 'h2',
      content: 'Page not found',
    });
    const btn = new Button({
      parentNode: this.node,
      color: 'primary',
      size: 'md',
      text: 'Back to main',
    });
    btn.node.onclick = () => navigate?.(APP_ROUTES.HOME);
  }
}
