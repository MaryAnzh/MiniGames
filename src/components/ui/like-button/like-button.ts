import { Button, type ButtonProps } from '@ui';

const CountRefactor = (count: number) => {
  return count >= 1099 ? `${(count / 1000).toFixed(1)} K` : count.toString();
};

type LikeButtonProps = ButtonProps & {
  withText?: boolean;
  isLight?: boolean;
  isIcon?: boolean;
  value?: number;
  isSkeleton?: boolean;
};

export class LikeButton extends Button {
  private isPressed = false;
  private withText: boolean = false;
  private isLight: boolean = false;

  constructor({ withText, isLight, isIcon, value, ...props }: LikeButtonProps) {
    super({
      ...props,
      leftIcon: 'favorite',
      ariaLabel: props.ariaLabel ?? 'Like this game',
      text: withText
        ? 'Add to Favorites'
        : value !== undefined && value >= -1
          ? CountRefactor(value)
          : undefined,
      variant: isIcon ? 'empty' : props.variant,
    });
    this.withText = Boolean(withText);
    this.isLight = Boolean(isLight);

    if (isLight) {
      this.node.style.color = 'var(--white)';
    }

    this.initAccessibility();
    this.initToggleLogic();
  }

  private initAccessibility() {
    this.setAttributes([
      { attr: 'role', value: 'button' },
      { attr: 'aria-label', value: this.node.getAttribute('aria-label') ?? 'Like this game' },
      { attr: 'aria-pressed', value: 'false' },
      { attr: 'tabindex', value: '0' },
      { attr: 'data-action', value: 'like' },
    ]);
  }

  private initToggleLogic() {
    this.node.onclick = () => {
      this.isPressed = !this.isPressed;

      this.node.setAttribute('aria-pressed', String(this.isPressed));

      if (this.isPressed) {
        this.node.style.color = 'var(--like)';
        if (this.withText) {
          super.setText('In your Favorites');
        }
      } else {
        this.node.style.color = this.isLight ? 'var(--white)' : 'var(--on-primary)';
        if (this.withText) {
          super.setText('Add to Favorites');
        }
      }
    };
  }
}
