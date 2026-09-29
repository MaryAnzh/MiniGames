import { Component } from '@components';
import type { ComponentProps, IconPickerType } from '@types';
import { Icon, Button } from '@ui';

type SnackbarType = 'success' | 'error' | 'info';

type SnackbarProps = Pick<ComponentProps, 'parentNode'> & {
  message: string;
  type: SnackbarType;
  duration?: number;
  onClose: () => void;
};

export class Snackbar extends Component {
  private closeBtn: Button;

  constructor({ parentNode, message, type = 'info', duration = 3000, onClose }: SnackbarProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'app-snackbar',
      attrs: [{ attr: 'data-type', value: type }],
    });

    this.closeBtn = new Button({
      parentNode: this.node,
      leftIcon: 'close',
      color: 'dark',
      size: 'icon-sm',
      ariaLabel: 'Close Snackbar',
      className: 'app-snackbar_close-btn',
    });
    this.closeBtn.node.onclick = () => onClose();

    new Icon({
      parentNode: this.node,
      icon: type,
      className: 'app-snackbar_icon',
    });

    new Component({
      parentNode: this.node,
      tagName: 'span',
      className: 'app-snackbar_text',
      content: message,
    });
  }

  destroy() {
    if (this.closeBtn) {
      this.closeBtn.node.onclick = null;
    }
    super.destroy();
  }
}
