import { ADD_TO_FAVORITES, LOADING, REMOVE_FROM_FAVORITES } from '@constants';
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
  callback?: () => Promise<{
    isLiked: boolean;
    likesCount: number;
  }>;
};

export class LikeButton extends Button {
  private isLight = false;
  private withText = false;
  private isFavorite = false;
  private callback?: LikeButtonProps['callback'];

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
          ? REMOVE_FROM_FAVORITES
          : ADD_TO_FAVORITES
        : value !== undefined
          ? CountRefactor(value)
          : undefined,
      variant: isIcon ? 'empty' : props.variant,
      className: `app-like-button`,
    });

    this.withText = Boolean(withText);
    this.isFavorite = Boolean(isFavorite);
    this.isLight = Boolean(isLight);
    this.callback = callback;

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
    ]);
  }

  private initLogic() {
    if (!this.callback) return;

    this.node.onclick = async () => {
      this.setLoading(true);

      try {
        const { isLiked, likesCount } = await this.callback!();

        this.setLiked(isLiked);
        this.setCount(likesCount);
      } finally {
        this.setLoading(false);
      }
    };
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
        super.setText(this.isFavorite ? REMOVE_FROM_FAVORITES : ADD_TO_FAVORITES);
      }
    }
  }

  public setLiked(isLiked: boolean) {
    this.isFavorite = isLiked;

    this.node.setAttribute('aria-pressed', String(isLiked));
    this.node.style.color = isLiked
      ? 'var(--like)'
      : this.isLight
        ? 'var(--white)'
        : 'var(--on-primary)';

    if (this.withText) {
      super.setText(isLiked ? REMOVE_FROM_FAVORITES : ADD_TO_FAVORITES);
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
