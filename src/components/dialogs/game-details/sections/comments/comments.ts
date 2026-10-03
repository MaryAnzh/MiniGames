import { Component } from '@components';
import type { ComponentProps, GameComment } from '@types';
import { Button, LikeButton, Skeleton, SkeletonText } from '@ui';
import { DARK, LIGHT } from '@constants';
import { arrayFromNumber, getRandomAvatarColor } from '@utils';

type CommentsSectionProps = Pick<ComponentProps, 'parentNode'> & {
  comments: GameComment[];
  isSkeleton?: boolean;
};

export class CommentsSection extends Component {
  private comments: GameComment[];
  private textarea!: HTMLTextAreaElement;
  private isSkeleton: boolean;
  private commentsDefaultCount = 3;

  constructor({ parentNode, comments, isSkeleton }: CommentsSectionProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'game-details-comments',
    });

    this.comments = comments;
    this.isSkeleton = Boolean(isSkeleton);

    this.render();
  }

  private render() {
    /* TITLE */
    if (this.isSkeleton) {
      new SkeletonText({
        parentNode: this.node,
        rows: 1,
        columns: 2,
        variant: 'multi',
        color: LIGHT,
        className: 'game-details-comments_title-skeleton',
      });
    } else {
      new Component({
        parentNode: this.node,
        tagName: 'h3',
        className: 'game-details-comments_title',
        content: `Comments (${this.comments.length})`,
      });
    }

    /* NEW COMMENT */
    const newCommentWrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'game-details-comments_new',
    });

    if (this.isSkeleton) {
      new Skeleton({
        parentNode: newCommentWrap.node,
        color: LIGHT,
        className: 'game-details-comments_new-avatar-skeleton',
      });

      new Skeleton({
        parentNode: newCommentWrap.node,
        color: LIGHT,
        className: 'game-details-comments_new-textarea-skeleton',
      });

      new Skeleton({
        parentNode: newCommentWrap.node,
        color: LIGHT,
        className: 'game-details-comments_new-send-skeleton',
      });
    } else {
      /* Avatar */
      new Component({
        parentNode: newCommentWrap.node,
        tagName: 'div',
        className: 'game-details-comments_new-avatar',
        content: 'U',
      });

      /* Textarea */
      const textareaWrap = new Component({
        parentNode: newCommentWrap.node,
        tagName: 'div',
        className: 'game-details-comments_new-textarea',
      });

      this.textarea = document.createElement('textarea');
      this.textarea.className = 'game-details-comments_textarea';
      this.textarea.placeholder = 'Write a comment...';
      this.textarea.rows = 1;

      this.textarea.addEventListener('input', () => this.autoGrow());
      textareaWrap.node.appendChild(this.textarea);

      /* Send button */
      new Button({
        parentNode: newCommentWrap.node,
        className: 'game-details-comments_new-send',
        size: 'icon-md',
        color: DARK,
        leftIcon: 'send',
        ariaLabel: 'Send comment',
      });
    }

    /* COMMENTS LIST */
    const list = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'game-details-comments_list',
    });

    if (this.isSkeleton) {
      arrayFromNumber(this.commentsDefaultCount).forEach(() =>
        this.renderSkeletonComment(list.node),
      );
    } else {
      this.comments.forEach((c) => this.renderComment(list.node, c));
    }
  }

  private renderSkeletonComment(parent: HTMLElement) {
    const card = new Component({
      parentNode: parent,
      tagName: 'div',
      className: ['game-details-comments_card', 'game-details-comments_card-skeleton'],
    });

    const header = new Component({
      parentNode: card.node,
      tagName: 'div',
      className: 'game-details-comments_card-header',
    });

    new Skeleton({
      parentNode: header.node,
      color: LIGHT,
      className: 'game-details-comments_card-avatar-skeleton',
    });

    new SkeletonText({
      parentNode: header.node,
      color: LIGHT,
      className: 'game-details-comments_card-username-skeleton',
    });

    new Skeleton({
      parentNode: header.node,
      color: LIGHT,
      className: 'game-details-comments_card-time-skeleton',
    });

    new SkeletonText({
      parentNode: card.node,
      rows: 2,
      columns: 2,
      variant: 'multi',
      color: LIGHT,
      className: 'game-details-comments_card-text-skeleton',
    });

    const footer = new Component({
      parentNode: card.node,
      tagName: 'div',
      className: 'game-details-comments_card-footer',
    });

    new Skeleton({
      parentNode: footer.node,
      color: LIGHT,
      className: 'game-details-comments_like-skeleton',
    });

    new Skeleton({
      parentNode: footer.node,
      color: LIGHT,
      className: 'game-details-comments_like-count-skeleton',
    });
  }

  private renderComment(parent: HTMLElement, c: GameComment) {
    const card = new Component({
      parentNode: parent,
      tagName: 'div',
      className: 'game-details-comments_card',
    });

    /* HEADER */
    const header = new Component({
      parentNode: card.node,
      tagName: 'div',
      className: 'game-details-comments_card-header',
    });

    const left = new Component({
      parentNode: header.node,
      tagName: 'div',
      className: 'game-details-comments_card-user',
    });

    const avatar = new Component({
      parentNode: left.node,
      tagName: 'div',
      className: 'game-details-comments_card-avatar',
      content: c.authorName.at(0),
    });
    avatar.node.style.background = `var(${getRandomAvatarColor().token})`;

    new Component({
      parentNode: left.node,
      tagName: 'span',
      className: 'game-details-comments_card-username',
      content: c.authorName,
    });

    new Component({
      parentNode: header.node,
      tagName: 'span',
      className: 'game-details-comments_card-time',
      content: c.createdAt,
    });

    /* TEXT */
    new Component({
      parentNode: card.node,
      tagName: 'p',
      className: 'game-details-comments_card-text',
      content: c.text,
    });

    /* FOOTER */
    const footer = new Component({
      parentNode: card.node,
      tagName: 'div',
      className: 'game-details-comments_card-footer',
    });

    const likeWrap = new Component({
      parentNode: footer.node,
      tagName: 'div',
      className: 'game-details-comments_like',
    });

    new LikeButton({ parentNode: likeWrap.node, isIcon: true, value: c.likesCount });
  }

  private autoGrow() {
    const maxHeight = 88;
    this.textarea.style.height = 'auto';

    const newHeight = Math.min(this.textarea.scrollHeight, maxHeight);
    this.textarea.style.height = `${newHeight}px`;

    this.textarea.style.overflowY = newHeight >= maxHeight ? 'auto' : 'hidden';
  }
}
