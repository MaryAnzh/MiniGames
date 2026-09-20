import { Component } from '@components';

type PortalProps = {
  className?: string;
  onClose?: () => void;
  position?: 'top';
};

export class Portal extends Component {
  private timeout: number | null = null;
  private onClose?: () => void;

  constructor({ className, onClose, position }: PortalProps = {}) {
    super({
      parentNode: null,
      tagName: 'div',
      className: ['app_portal', className ?? '', `portal_${position ?? 'center'}`].filter(Boolean),
      attrs: [{ attr: 'id', value: 'appPortal' }],
    });
    this.onClose = onClose;

    this.node.addEventListener('click', this.handleOutsideClick);
  }

  handleOutsideClick = (event: Event) => {
    const target = event.target as HTMLElement;

    if (target.id === 'appPortal') {
      if (this.onClose) this.onClose();
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

    super.destroy();
  }
}
