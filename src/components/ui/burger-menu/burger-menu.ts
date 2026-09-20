import { Component } from '@components';
import { GoogleIcon, Button } from '@ui';
import { ICON_PICKER } from '@constants';

type BurgerMenuProps = {
  parentNode: HTMLElement;
  isAuth: boolean;
  onClose: () => void;
};

export class BurgerMenu extends Component {
  closeBtn: Component | null = null;
  onClose: () => void;

  constructor({ parentNode, isAuth, onClose }: BurgerMenuProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'burger',
    });
    this.onClose = onClose;

    this.render(isAuth);
  }

  private render(isAuth: boolean) {
    const header = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'burger_header',
    });

    const brand = new Component({
      parentNode: header.node,
      tagName: 'div',
      className: 'burger_brand',
    });

    brand.node.insertAdjacentHTML('beforeend', ICON_PICKER.LOGO);

    new Component({
      parentNode: brand.node,
      tagName: 'span',
      className: 'burger_brand-title',
      content: 'MiniGames',
    });

    this.closeBtn = new Component({
      parentNode: header.node,
      tagName: 'button',
      className: 'burger_close_btn',
    });
    new GoogleIcon({ parentNode: this.closeBtn.node, iconName: 'close' });
    this.closeBtn.node.addEventListener('click', this.onClose);

    const LINKS = ['Home', 'Library', 'Tournaments', 'Community'];

    const linksWrap = new Component({
      parentNode: this.node,
      tagName: 'nav',
      className: 'burger_links',
    });

    LINKS.forEach((item, index) => {
      new Component({
        parentNode: linksWrap.node,
        tagName: 'button',
        className: ['burger_link', index === 0 ? 'is-active' : ''].filter(Boolean),
        content: item,
      });
    });

    /* BOTTOM BUTTONS */
    const bottom = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'burger_bottom',
    });

    if (isAuth) {
      new Button({
        parentNode: bottom.node,
        text: 'Log Out',
        size: 'md',
        colorVariant: 'ghost',
        className: 'burger_logout_btn',
      });
    } else {
      new Button({
        parentNode: bottom.node,
        text: 'Log In',
        size: 'md',
        colorVariant: 'ghost',
        className: 'burger_login_btn',
      });

      new Button({
        parentNode: bottom.node,
        text: 'Sign Up',
        size: 'md',
        colorVariant: 'primary',
        className: 'burger_signup_btn',
      });
    }
  }

  destroy(): void {
    if (this.closeBtn) {
      this.closeBtn.node.removeEventListener('click', this.onClose);
    }
    super.destroy();
  }
}
