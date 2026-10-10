import { ICON_PICKER, APP_PAGES, REGISTER, LOGIN } from '@constants';
import { Component } from '@components';
import { Button } from '@ui';
import type { AuthFormType, ComponentProps } from '@types';
import { Router } from '@route';
import { appStore } from '@store';

type BurgerMenuProps = Pick<ComponentProps, 'parentNode'> & {
  isAuth: boolean;
  router: Router;
  onClose: () => void;
  onOpenAuth: (tab: AuthFormType) => void;
};

export class BurgerMenu extends Component {
  closeBtn: Component | null = null;
  router: Router;
  onClose: () => void;
  onOpenAuth: (tab: AuthFormType) => void;
  store = appStore;
  children: Component[] = [];

  items: Component[] = [];
  highlightClass = 'is-active';

  constructor({ parentNode, isAuth, router, onClose, onOpenAuth }: BurgerMenuProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'burger',
    });

    this.router = router;
    this.onClose = onClose;
    this.onOpenAuth = onOpenAuth;

    this.render(isAuth);
  }

  private render(isAuth: boolean) {
    /* HEADER */
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

    brand.node.insertAdjacentHTML('beforeend', ICON_PICKER.logo);

    new Component({
      parentNode: brand.node,
      tagName: 'span',
      className: 'burger_brand-title',
      content: 'MiniGames',
    });

    this.closeBtn = new Button({
      parentNode: header.node,
      className: 'burger_close_btn',
      leftIcon: 'close',
      color: 'dark',
      size: 'icon-md',
      corner: 'sm',
      ariaLabel: 'Close button',
    });
    this.closeBtn.node.onclick = () => this.onClose();

    /* ROUTES */
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

    APP_PAGES.forEach(({ name, path }) => {
      const item = new Component({
        parentNode: linksListWrap.node,
        tagName: 'button',
        className: ['burger_links_list_link'],
        content: name,
      });

      item.node.onclick = () => {
        this.router.navigate(path);
        this.onClose();
      };

      this.items.push(item);
    });

    this.highlight(this.store.currentRoute);

    /* BOTTOM BUTTONS */
    const bottom = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'burger_bottom',
    });

    if (!isAuth) {
      const loginBtn = new Button({
        parentNode: bottom.node,
        text: isAuth ? 'Log Out' : 'Log In',
        size: 'md',
        color: 'ghost',
        className: isAuth ? 'burger_logout_btn' : 'burger_login_btn',
        fullWidth: true,
      });
      loginBtn.node.onclick = () => {
        this.onClose();
        this.onOpenAuth(LOGIN);
      };

      const signupBtn = new Button({
        parentNode: bottom.node,
        text: 'Sign Up',
        size: 'md',
        color: 'primary',
        className: 'burger_signup_btn',
        fullWidth: true,
      });
      signupBtn.node.onclick = () => {
        this.onClose();
        this.onOpenAuth(REGISTER);
      };
      this.children.push(loginBtn, signupBtn);
    } else {
      const logoutBtn = new Button({
        parentNode: bottom.node,
        className: 'burger_bottom_btn',
        text: 'Log Out',
        color: 'ghost',
      });

      // Check Logic!!
      // logoutBtn.node.onclick = () => {
      //   this.store.logout();
      //   this.router.navigate('/');
      //   this.onClose();
      // };
      this.children.push(logoutBtn);
    }
  }

  highlight(path: string) {
    this.items.forEach((item) => {
      item.node.classList.remove(this.highlightClass);

      const text = item.node.textContent?.toLowerCase();
      if (path.includes(text)) {
        item.node.classList.add(this.highlightClass);
      }
    });
  }

  destroy(): void {
    if (this.closeBtn) {
      this.closeBtn.node.onclick = null;
    }
    this.items.forEach((item) => {
      item.node.onclick = null;
    });
    this.children.forEach((child) => {
      if (child instanceof Button) {
        child.node.onclick = null;
      }
    });
    super.destroy();
  }
}
