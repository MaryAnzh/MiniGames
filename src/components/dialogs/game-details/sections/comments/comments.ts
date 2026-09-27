import { Component } from '@components';
import type { ComponentProps } from '@types';
import { Button, LikeButton } from '@ui';
import { MOCK_COMMENTS } from './mock';

type CommentData = {
  id: number;
  avatarColor: string;
  avatarLetter: string;
  username: string;
  timeAgo: string;
  text: string;
  likes: number;
  liked: boolean;
};

type CommentsSectionProps = Pick<ComponentProps, 'parentNode'>;

export class CommentsSection extends Component {
  private comments: CommentData[];
  private textarea!: HTMLTextAreaElement;

  constructor({ parentNode }: CommentsSectionProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'comments',
    });

    this.comments = MOCK_COMMENTS;
    this.render();
  }

  private render() {
    /* TITLE */
    new Component({
      parentNode: this.node,
      tagName: 'h3',
      className: 'comments_title',
      content: `Comments (${this.comments.length})`,
    });

    /* NEW COMMENT */
    const newCommentWrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'comments_new',
    });

    /* Avatar */
    new Component({
      parentNode: newCommentWrap.node,
      tagName: 'div',
      className: 'comments_new-avatar',
      content: 'U',
    });

    /* Textarea */
    const textareaWrap = new Component({
      parentNode: newCommentWrap.node,
      tagName: 'div',
      className: 'comments_new-textarea',
    });

    this.textarea = document.createElement('textarea');
    this.textarea.className = 'comments_textarea';
    this.textarea.placeholder = 'Write a comment...';
    this.textarea.rows = 1;

    this.textarea.addEventListener('input', () => this.autoGrow());
    textareaWrap.node.appendChild(this.textarea);

    /* Send button */
    new Button({
      parentNode: newCommentWrap.node,
      className: 'comments_new-send',
      size: 'icon-md',
      color: 'dark',
      leftIcon: 'send',
      ariaLabel: 'Send comment',
    });

    /* COMMENTS LIST */
    const list = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'comments_list',
    });

    this.comments.forEach((c) => this.renderComment(list.node, c));
  }

  private renderComment(parent: HTMLElement, c: CommentData) {
    const card = new Component({
      parentNode: parent,
      tagName: 'div',
      className: 'comments_card',
    });

    /* HEADER */
    const header = new Component({
      parentNode: card.node,
      tagName: 'div',
      className: 'comments_card-header',
    });

    const left = new Component({
      parentNode: header.node,
      tagName: 'div',
      className: 'comments_card-user',
    });

    const avatar = new Component({
      parentNode: left.node,
      tagName: 'div',
      className: 'comments_card-avatar',
      content: c.avatarLetter,
    });
    avatar.node.style.background = c.avatarColor;

    new Component({
      parentNode: left.node,
      tagName: 'span',
      className: 'comments_card-username',
      content: c.username,
    });

    new Component({
      parentNode: header.node,
      tagName: 'span',
      className: 'comments_card-time',
      content: c.timeAgo,
    });

    /* TEXT */
    new Component({
      parentNode: card.node,
      tagName: 'p',
      className: 'comments_card-text',
      content: c.text,
    });

    /* FOOTER */
    const footer = new Component({
      parentNode: card.node,
      tagName: 'div',
      className: 'comments_card-footer',
    });

    const likeWrap = new Component({
      parentNode: footer.node,
      tagName: 'div',
      className: 'comments_like',
    });
    new LikeButton({ parentNode: footer.node, isIcon: true });

    new Component({
      parentNode: likeWrap.node,
      tagName: 'span',
      className: 'comments_like-count',
      content: String(c.likes),
    });
  }

  private autoGrow() {
    const maxHeight = 88;
    this.textarea.style.height = 'auto';

    const newHeight = Math.min(this.textarea.scrollHeight, maxHeight);
    this.textarea.style.height = `${newHeight}px`;

    if (newHeight >= maxHeight) {
      this.textarea.style.overflowY = 'auto';
    } else {
      this.textarea.style.overflowY = 'hidden';
    }
  }
}
