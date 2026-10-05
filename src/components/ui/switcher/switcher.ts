import { Component } from '@components';
import type { AuthTabType } from '@types';

type SwitcherProps = {
  parentNode: HTMLElement;
  tabs: AuthTabType[];
  active: AuthTabType;
  onChange: (tab: AuthTabType) => void;
};

export class Switcher extends Component {
  tabs: Component[] = [];

  constructor({ parentNode, tabs, active, onChange }: SwitcherProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'app_switcher',
    });

    tabs.forEach((tab) => {
      const btn = new Component({
        parentNode: this.node,
        tagName: 'button',
        className: ['app_switcher_btn', tab === active ? 'is-active' : ''],
      });
      new Component({
        parentNode: btn.node,
        tagName: 'span',
        className: 'app_switcher_btn_text',
        content: tab,
      });
      this.tabs.push(btn);
      btn.node.onclick = () => onChange(tab);
    });
  }

  destroy() {
    this.tabs.forEach((tab) => {
      tab.node.onclick = null;
      tab.destroy();
    });
    super.destroy();
  }
}
