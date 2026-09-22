import { Component } from '@components';

type PortalProps = {
  className?: string;
  position?: 'top';
};

export class Portal extends Component {
  private timeout: number | null = null;

  constructor({ className, position }: PortalProps = {}) {
    super({
      parentNode: null,
      tagName: 'div',
      className: ['app_portal', className ?? '', `portal_${position ?? 'center'}`].filter(Boolean),
      attrs: [{ attr: 'id', value: 'appPortal' }],
    });

    this.node.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('keydown', this.handleEsc);
  }

  handleOutsideClick = (event: Event) => {
    const target = event.target as HTMLElement;

    if (target.id === 'appPortal') {
      this.unmount();
    }
  };

  handleEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.unmount();
    }
  };

  mount(content: HTMLElement) {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.node.innerHTML = '';

    document.body.appendChild(this.node);

    this.node.appendChild(content);

    this.node.classList.add('app_portal_open');
  }

  unmount() {
    this.node.classList.remove('app_portal_open');

    this.timeout = window.setTimeout(() => {
      this.node.innerHTML = '';
      if (this.node.parentNode) {
        this.node.parentNode.removeChild(this.node);
      }
    }, 300);
  }

  destroy() {
    this.node.innerHTML = '';

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.node.removeEventListener('click', this.handleOutsideClick);

    this.node.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleEsc);

    super.destroy();
  }
}
