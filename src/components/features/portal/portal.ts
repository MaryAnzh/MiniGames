import { Component } from '@components';

type PortalProps = {
  className?: string;
  position?: 'top';
};

export class Portal extends Component {
  private timeout: number | null = null;
  _onClose: (() => void) | null = null;
  set onClose(callback: () => void) {
    this._onClose = callback;
  }

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

  private closePortal = () => {
    if (this._onClose) {
      this._onClose();
    }
  };

  private handleOutsideClick = (event: Event) => {
    const target = event.target as HTMLElement;

    if (target.id === 'appPortal') {
      this.closePortal();
    }
  };

  private handleEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.closePortal();
    }
  };

  mount(content: HTMLElement) {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    document.body.style.overflow = 'hidden';
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
        document.body.style.overflow = 'auto';
      }
    }, 300);
  }

  destroy() {
    this.node.innerHTML = '';
    if (this._onClose) {
      this._onClose = null;
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.node.removeEventListener('click', this.handleOutsideClick);

    this.node.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleEsc);

    super.destroy();
  }
}
