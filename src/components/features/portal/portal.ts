import { Component } from '@components';

type PortalProps = {
  className?: string;
  position?: 'top';
};

export class Portal extends Component {
  private timeout: number | null = null;
  private activeComponent: Component | null = null;
  private isLocked = false; // ← добавили флаг
  onClose: (() => void) | null = null;

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

  mount(content: HTMLElement, component?: Component) {
    this.activeComponent = component ?? null;

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

  private closePortal = () => {
    if (this.isLocked) return;
    this.onClose?.();
  };

  private handleOutsideClick = (event: Event) => {
    if (this.isLocked) return;
    if ((event.target as HTMLElement).id === 'appPortal') {
      this.closePortal();
    }
  };

  private handleEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.closePortal();
    }
  };

  unmount() {
    this.node.classList.remove('app_portal_open');

    this.timeout = window.setTimeout(() => {
      this.activeComponent?.destroy();
      this.activeComponent = null;

      this.node.innerHTML = '';
      if (this.node.parentNode) {
        this.node.parentNode.removeChild(this.node);
        document.body.style.overflow = 'auto';
      }
    }, 300);
  }

  public lock() {
    this.isLocked = true;
  }

  public unlock() {
    this.isLocked = false;
  }
}
