import { ICON_PICKER } from '@constants';
import { Component } from '@components';
import { Button } from '@ui';
import type { AuthFormType, ComponentProps } from '@types';

type BurgerMenuProps = Pick<ComponentProps, 'parentNode'> & {
  isAuth: boolean;
  onClose: () => void;
  onOpenAuth: (tab: AuthFormType) => void;
};

export class BurgerMenu extends Component {
  closeBtn: Component | null = null;
  onClose: () => void;
  onOpenAuth: (tab: AuthFormType) => void;

  constructor({ parentNode, isAuth, onClose, onOpenAuth }: BurgerMenuProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'burger',
    });
    this.onClose = onClose;
    this.onOpenAuth = onOpenAuth;

    this.render(isAuth);
  }

  private render(isAuth: boolean) {
    // for check isAuth = true
    //isAuth = true;

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
    this.closeBtn.node.addEventListener('click', this.onClose);

    const LINKS = ['Home', 'Library', 'Tournaments', 'Community'];

    const linksWrap = new Component({
      parentNode: this.node,
      tagName: 'nav',
      className: 'burger_links',
    });

    const linksListWrap = new Component({
      parentNode: linksWrap.node,
      tagName: 'ul',
      className: 'burger_links_list',
    });

    LINKS.forEach((item, index) => {
      new Component({
        parentNode: linksListWrap.node,
        tagName: 'button',
        className: ['burger_links_list_link', index === 0 ? 'is-active' : ''].filter(Boolean),
        content: item,
      });
    });

    /* BOTTOM BUTTONS */
    const bottom = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'burger_bottom',
    });

    new Button({
      parentNode: bottom.node,
      text: isAuth ? 'Log Out' : 'Log In',
      size: 'md',
      color: 'ghost',
      className: isAuth ? 'burger_logout_btn' : 'burger_login_btn',
      fullWidth: true,
    }).node.addEventListener('click', () => this.onOpenAuth('Login'));

    new Button({
      parentNode: bottom.node,
      text: 'Sign Up',
      size: 'md',
      color: 'primary',
      className: 'burger_signup_btn',
      fullWidth: true,
    }).node.addEventListener('click', () => this.onOpenAuth('Register'));
  }

  destroy(): void {
    if (this.closeBtn) {
      this.closeBtn.node.removeEventListener('click', this.onClose);
    }
    super.destroy();
  }
}
