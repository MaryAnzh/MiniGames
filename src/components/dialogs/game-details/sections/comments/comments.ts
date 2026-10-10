import { Component } from '@components';
import type { ComponentProps, GameComment } from '@types';
import { Button, LikeButton, Skeleton, SkeletonText } from '@ui';
import { APP_ROUTES, DARK, ERROR, LIGHT, SUCCESS } from '@constants';
import { arrayFromNumber, getInitials, getRandomAvatarColor } from '@utils';
import appStore from '@store';

type CommentsSectionProps = Pick<ComponentProps, 'parentNode'> & {
  comments: GameComment[];
  isSkeleton?: boolean;
  navigateTo: (path: string) => void;
  slug: string;
};

export class CommentsSection extends Component {
  private comments: GameComment[];
  private textarea!: HTMLTextAreaElement;
  private sendButton!: Button;
  private isSkeleton: boolean;
  private commentsDefaultCount = 3;

  private isAuth: boolean;
  private userName?: string;
  private navigateTo: (path: string) => void;
  private slug: string;

  constructor({ parentNode, comments, isSkeleton, navigateTo, slug }: CommentsSectionProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'game-details-comments',
    });

    this.comments = comments;
    this.isSkeleton = Boolean(isSkeleton);
    this.slug = slug;

    this.isAuth = appStore.isAuth;
    this.userName = appStore.username;
    this.navigateTo = navigateTo;

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
        content: this.isAuth ? this.userName?.at(0)?.toUpperCase() : 'U',
      });

      /* Textarea */
      const textareaWrap = new Component({
        parentNode: newCommentWrap.node,
        tagName: 'div',
        className: 'game-details-comments_new-textarea',
      });

      this.textarea = document.createElement('textarea');
      this.textarea.className = 'game-details-comments_textarea';
      this.textarea.placeholder = this.isAuth ? 'Write a comment...' : 'Login to write a comment';
      this.textarea.rows = 1;

      this.textarea.addEventListener('input', () => this.autoGrow());
      this.textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSubmit();
        }
      });

      if (!this.isAuth) {
        this.textarea.disabled = true;
      }

      textareaWrap.node.appendChild(this.textarea);

      /* Send button */
      this.sendButton = new Button({
        parentNode: newCommentWrap.node,
        className: 'game-details-comments_new-send',
        size: 'icon-md',
        color: DARK,
        leftIcon: 'send',
        ariaLabel: 'Send comment',
        disabled: !this.isAuth,
      });

      this.sendButton.node.onclick = () => this.handleSubmit();
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
    } else if (this.comments.length === 0) {
      this.renderEmptyState(list.node);
    } else {
      this.comments.forEach((c) => this.renderComment(list.node, c));
    }
  }

  private renderEmptyState(parent: HTMLElement) {
    new Component({
      parentNode: parent,
      tagName: 'div',
      className: 'game-details-comments_empty',
      content: 'No comments yet. Be the first!',
    });
  }

  private validateText(text: string) {
    const trimmed = text.trim();
    return trimmed.length >= 1 && trimmed.length <= 500 ? trimmed : null;
  }

  private lockForm() {
    this.textarea.disabled = true;
    this.sendButton.setDisabled(true);
  }

  private unlockForm() {
    this.textarea.disabled = !this.isAuth;
    this.sendButton.setDisabled(!this.isAuth);
  }

  private async handleSubmit() {
    if (!this.isAuth) {
      this.navigateTo(APP_ROUTES.AUTH_LOGIN);
      appStore.showSnack('Login to write a comment', 'info');
      return;
    }

    const text = this.validateText(this.textarea.value);
    if (!text) {
      appStore.showSnack('Comment must be 1–500 characters', 'error');
      return;
    }

    this.lockForm();

    try {
      const res = await appStore.postComment(this.slug, text);

      if (res.status !== SUCCESS) {
        this.unlockForm();
        appStore.showSnack('Failed to send comment', 'error');
        return;
      }

      // success
      this.textarea.value = '';
      this.autoGrow();

      await this.refreshComments();

      appStore.showSnack('Comment added', 'success');
    } catch {
      this.unlockForm();
      appStore.showSnack('Unknown error. Comment not sent.', 'error');
    }
  }

  private async refreshComments() {
    const res = await appStore.getGameComments(this.slug, {
      limit: 5,
      sort: 'newest',
    });

    if (res.status === SUCCESS) {
      this.comments = res.data.data;
      this.node.replaceChildren();
      this.render();
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
      content: getInitials(c.authorName),
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

    new LikeButton({
      parentNode: likeWrap.node,
      isIcon: true,
      value: c.likesCount,
      isFavorite: c.isLikedByCurrentUser,
      callback: async () => {
        if (!this.isAuth) {
          this.navigateTo(APP_ROUTES.AUTH_LOGIN);
          appStore.showSnack('Login to like comments', 'info');
          return { status: ERROR, error: 'Login to like comments' };
        }

        return await appStore.toggleCommentLike(c.commentId);
      },
    });
  }

  private autoGrow() {
    const maxHeight = 88;
    this.textarea.style.height = 'auto';

    const newHeight = Math.min(this.textarea.scrollHeight, maxHeight);
    this.textarea.style.height = `${newHeight}px`;

    this.textarea.style.overflowY = newHeight >= maxHeight ? 'auto' : 'hidden';
  }
}
