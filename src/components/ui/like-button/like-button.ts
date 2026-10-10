import { ADD_TO_FAVORITES, LOADING, YOUR_FAVORITES, SUCCESS } from '@constants';
import type { CommentToggleResponseType } from '@types';
import { Button, type ButtonProps } from '@ui';

const CountRefactor = (count: number) => {
  return count >= 1099 ? `${(count / 1000).toFixed(1)} K` : count.toString();
};

export type LikeButtonProps = ButtonProps & {
  withText?: boolean;
  isLight?: boolean;
  isIcon?: boolean;
  value?: number;
  isSkeleton?: boolean;
  isFavorite?: boolean;
  callback?: () => Promise<CommentToggleResponseType>;
};

export class LikeButton extends Button {
  private withText = false;
  private isFavorite = false;
  private callback?: LikeButtonProps['callback'];
  private count?: number;

  constructor({
    withText,
    isLight,
    isIcon,
    value,
    disabled,
    isFavorite,
    callback,
    ...props
  }: LikeButtonProps) {
    super({
      ...props,
      leftIcon: 'favorite',
      ariaLabel: props.ariaLabel ?? 'Like this game',
      text: withText
        ? isFavorite
          ? YOUR_FAVORITES
          : ADD_TO_FAVORITES
        : value !== undefined
          ? CountRefactor(value)
          : undefined,
      variant: isIcon ? 'empty' : props.variant,
      className: `app-like-button`,
    });
    this.withText = Boolean(withText);
    this.isFavorite = Boolean(isFavorite);
    this.callback = callback;
    this.count = value;

    this.initColor(Boolean(isLight));
    this.setLiked(Boolean(isFavorite));
    this.setDisabled(disabled);
    this.initAccessibility();
    this.initLogic();
  }

  private initAccessibility() {
    this.setAttributes([
      { attr: 'role', value: 'button' },
      { attr: 'aria-label', value: this.node.getAttribute('aria-label') ?? 'Like this game' },
      { attr: 'aria-pressed', value: String(this.isFavorite) },
      { attr: 'tabindex', value: '0' },
      { attr: 'data-action', value: 'like' },
      { attr: 'title', value: `${this.count}` },
    ]);
  }

  private initLogic() {
    if (!this.callback) return;

    this.node.onclick = async () => {
      this.setLoading(true);

      try {
        const res = await this.callback!();
        if (res.status === SUCCESS) {
          const { isLikedByCurrentUser, likesCount } = res.data;
          this.count = likesCount;

          this.setLiked(isLikedByCurrentUser);
          this.setCount(likesCount);
          this.setAttributes([{ attr: 'title', value: likesCount.toString() }]);
        }
      } finally {
        this.setLoading(false);
      }
    };
  }
  private initColor(isLight: boolean) {
    if (isLight) {
      this.node.classList.add('app-like-button_light');
    }
  }

  public setLoading(isLoading: boolean) {
    if (isLoading) {
      this.node.classList.add('app-like-button_loading');
      this.setDisabled(true);

      if (this.withText) {
        super.setText(`${LOADING}...`);
      }
    } else {
      this.node.classList.remove('app-like-button_loading');
      this.setDisabled(false);

      if (this.withText) {
        super.setText(this.isFavorite ? YOUR_FAVORITES : ADD_TO_FAVORITES);
      }
    }
  }

  public setLiked(isLiked: boolean) {
    this.isFavorite = isLiked;

    this.node.setAttribute('aria-pressed', String(isLiked));
    if (isLiked) {
      this.node.classList.add('app-like-button_liked');
    } else {
      this.node.classList.remove('app-like-button_liked');
    }
    if (this.withText) {
      super.setText(isLiked ? YOUR_FAVORITES : ADD_TO_FAVORITES);
    }
  }

  public setCount(count: number) {
    if (!this.withText) {
      super.setText(CountRefactor(count));
    }
  }

  public setDisabled(value?: boolean) {
    if (value) {
      this.node.classList.add('app-like-button_disabled');
    } else {
      this.node.classList.remove('app-like-button_disabled');
    }
  }
}
