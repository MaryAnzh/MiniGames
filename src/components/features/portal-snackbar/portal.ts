import { Component } from '@components';
import { Snackbar } from '@ui';

export class SnackbarPortal extends Component {
  private snacks: { snack: Snackbar; timer?: number }[] = [];

  constructor() {
    super({
      parentNode: null,
      tagName: 'div',
      className: 'app_portal-snackbar',
    });
  }

  show(message: string, type: 'success' | 'error' | 'info', onClose?: () => void) {
    if (!this.node.parentNode) {
      document.body.appendChild(this.node);
    }

    const snack = new Snackbar({
      parentNode: this.node,
      message,
      type,
      onClose: () => {
        this.remove(snack);
        if (onClose) onClose();
      },
    });

    const timer = window.setTimeout(() => {
      this.remove(snack);
    }, 5000);

    this.snacks.push({ snack, timer });
    this.animateIn(snack.node);
  }

  private remove(snack: Snackbar) {
    const entry = this.snacks.find((s) => s.snack === snack);
    if (!entry) return;

    if (entry.timer) {
      clearTimeout(entry.timer);
    }

    this.animateOut(snack.node, () => {
      snack.destroy();
      this.snacks = this.snacks.filter((s) => s.snack !== snack);
      if (this.snacks.length === 0 && this.node.parentNode) {
        this.node.parentNode.removeChild(this.node);
      }
    });
  }

  private animateIn(node: HTMLElement) {
    node.classList.add('snackbar--in');
  }

  private animateOut(node: HTMLElement, cb: () => void) {
    node.classList.add('snackbar--out');
    node.addEventListener('transitionend', cb, { once: true });
  }
}
