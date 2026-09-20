import { Component } from '@components';

type PortalProps = {
  className?: string;
};

export class Portal extends Component {
  timeout: number | null = null;

  constructor({ className }: PortalProps = {}) {
    super({
      parentNode: null, // НЕ монтируем сразу
      tagName: 'div',
      className: ['app_portal', className ?? ''].filter(Boolean),
    });
  }

  mount(content: HTMLElement) {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    document.body.appendChild(this.node);

    this.node.appendChild(content);

    this.node.classList.add('app_portal_open');
  }

  unmount() {
    console.log(this.node);
    this.node.classList.remove('app_portal_open');

    this.timeout = setTimeout(() => {
      if (this.node.parentNode) {
        this.node.parentNode.removeChild(this.node);
      }

      this.node.innerHTML = '';
    }, 300);
  }

  destroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    super.destroy();
  }
}
