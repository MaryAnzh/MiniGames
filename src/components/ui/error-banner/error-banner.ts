import type { ComponentProps } from '@types';
import { Component } from '../../component';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';

type ErrorBannerProps = Pick<ComponentProps, 'parentNode'> & {
  message: string;
  onRetry?: () => void;
  className?: string;
  onClose?: () => void;
};

export class ErrorBanner extends Component {
  actionBtn: Button | null = null;

  constructor({ parentNode, message, onRetry, className, onClose }: ErrorBannerProps) {
    super({
      parentNode,
      tagName: 'div',
      className: ['app-error-banner', className ?? ''],
    });
    if (onClose) {
      const closeWrap = new Component({
        parentNode: this.node,
        tagName: 'span',
        className: 'app-error-banner_close',
      });
      const close = new Button({
        parentNode: closeWrap.node,
        color: 'light',
        size: 'icon-lg',
        leftIcon: 'close',
        ariaLabel: 'Close button',
        corner: 'circle',
      });
      close.node.onclick = () => onClose();
    }

    new Icon({
      parentNode: this.node,
      icon: 'error_icon',
      className: 'app-error-banner_icon',
    });

    new Component({
      parentNode: this.node,
      tagName: 'p',
      className: 'app-error-banner_text',
      content: message,
    });

    if (onRetry) {
      this.actionBtn = new Button({
        parentNode: this.node,
        text: 'Retry',
        color: 'primary',
        size: 'sm',
        corner: 'md',
        className: 'app-error-banner_retry',
        ariaLabel: 'Retry request',
      });
      this.actionBtn.node.onclick = () => onRetry();
    }
  }
  destroy(): void {
    if (this.actionBtn) {
      this.actionBtn.node.onclick = null;
    }
    this.node.innerHTML = '';
    super.destroy();
  }
}
