import { Component } from '@components';

type SwitcherProps = {
  parentNode: HTMLElement;
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
};

export class Switcher extends Component {
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
        content: tab,
      });

      btn.node.addEventListener('click', () => onChange(tab));
    });
  }
}
