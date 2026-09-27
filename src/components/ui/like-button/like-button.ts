import { Button, type ButtonProps } from '@ui';

type LikeButtonProps = ButtonProps & {
  withText?: boolean;
  isLight?: boolean;
  isIcon?: boolean;
};

export class LikeButton extends Button {
  private isPressed = false;
  private withText: boolean = false;
  private isLight: boolean = false;

  constructor({ withText, isLight, isIcon, ...props }: LikeButtonProps) {
    super({
      ...props,
      leftIcon: 'favorite',
      ariaLabel: props.ariaLabel ?? 'Like this game',
      text: withText ? 'Add to Favorites' : undefined,
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

        super.setText('Add to Favorites');
      }
    };
  }
}
