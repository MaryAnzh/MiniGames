import type { ComponentProps, IconPickerType } from '@types';
import { Component } from '../../component';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';

type EmptyStateProps = Pick<ComponentProps, 'parentNode'> & {
  title: string;
  description?: string;
  icon?: 'empty' | 'no_cards' | 'no_comments' | 'no_games' | 'no-info';
  className: string;
  actionText?: string;
  onAction?: () => void;
};

export class EmptyState extends Component {
  actionBtn: Component | null = null;

  constructor({
    parentNode,
    title,
    description,
    icon = 'empty',
    actionText,
    onAction,
    className,
  }: EmptyStateProps) {
    super({
      parentNode,
      tagName: 'div',
      className: ['app-empty-state', className ?? ''],
    });

    // icon
    new Icon({
      parentNode: this.node,
      icon: icon as IconPickerType,
      className: 'app-empty-state_icon',
    });

    // title
    new Component({
      parentNode: this.node,
      tagName: 'h3',
      className: 'app-empty-state_title',
      content: title,
    });

    // description
    if (description) {
      new Component({
        parentNode: this.node,
        tagName: 'p',
        className: 'app-empty-state_description',
        content: description,
      });
    }

    // action button
    if (actionText && onAction) {
      this.actionBtn = new Button({
        parentNode: this.node,
        text: actionText,
        color: 'primary',
        size: 'md',
        corner: 'md',
        ariaLabel: actionText,
        className: 'app-empty-state_btn',
      });

      this.actionBtn.node.onclick = () => onAction();
    }
  }

  destroy(): void {
    this.node.innerHTML = '';
    if (this.actionBtn) {
      this.actionBtn.node.onclick = null;
    }
    super.destroy();
  }
}
