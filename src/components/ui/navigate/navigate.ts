import type { ComponentProps } from '@types';
import { Component } from '../../component';
import { APP_PAGES, CUSTOM_EVENTS as e } from '@constants';
import { Router } from '@route';
import { appEvents } from '@utils';
import appStore from '@state';

type NavigateProps = Pick<ComponentProps, 'parentNode'> & {
  className: string;
  router: Router;
};

export class Navigate extends Component {
  private store: typeof appStore;

  items: Component[] = [];
  highlightClass = 'nav-highlight_item';

  constructor({ parentNode, className, router }: NavigateProps) {
    super({ parentNode, tagName: 'nav', className: ['app_nav', className] });
    this.store = appStore;

    const list = new Component({
      parentNode: this.node,
      tagName: 'ul',
      className: 'app_nav_list',
    });

    APP_PAGES.forEach(({ name, path }) => {
      const item = new Component({
        parentNode: list.node,
        className: ['app_nav_list_item'],
        content: name,
      });

      item.node.addEventListener('click', () => {
        router.navigate(path);
      });

      this.items.push(item);
    });

    this.highlight(this.store.currentRoute);

    appEvents.on(e.ROUTE_CHANGE, (path) => {
      this.highlight(path ?? '');
    });
  }

  highlight(path: string) {
    this.items.forEach((item) => {
      item.node.classList.remove(this.highlightClass);

      const text = item.node.textContent?.toLowerCase();
      item.node.classList.toggle(this.highlightClass, path.includes(text));
    });
  }
}
