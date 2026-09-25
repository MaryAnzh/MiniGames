import type { Router } from '@route';

import { Component, Portal } from '@components';
import { BurgerMenu, Button, Logo, Navigate } from '@ui';
import { AuthPopup } from 'src/components/pop-up/auth-form/auth-form';
import type { AuthFormType } from '@types';

type HeaderProps = {
  parentNode: HTMLElement | null;
  isAuth: boolean;
  router: Router;
};

export class Header extends Component {
  private portal: Portal;
  private burgerMenu: BurgerMenu;
  private burgerBtn: Component;
  private authPopup: AuthPopup;

  public isAuth: boolean = false;
  private handleOpen: () => void;

  constructor({ parentNode, isAuth, router }: HeaderProps) {
    super({ parentNode, tagName: 'header', className: 'header' });
    this.isAuth = isAuth;

    /** BRAND */
    new Logo({
      parentNode: this.node,
      withText: true,
      isTitle: true,
    });

    /** NAVIGATION */
    new Navigate({
      parentNode: this.node,
      className: 'header_nav',
      router,
    });

    /** PORTAL */
    this.portal = new Portal({});

    this.authPopup = new AuthPopup({
      parentNode: this.portal.node,
      tab: 'Login',
    });

    /** LOGIN BUTTON */
    const loginButton = new Button({
      parentNode: this.node,
      className: 'header_login_btn',
      text: 'Log In',
      response: 'md',
      color: 'light',
    });

    loginButton.node.addEventListener('click', () => {
      this.authPopup.activeTab = 'Login';
      this.authPopup.render();
      this.portal.mount(this.authPopup.node);
    });

    /** SIGNUP BUTTON */
    const signinButton = new Button({
      parentNode: this.node,
      className: 'header_signup_btn',
      text: 'Sign Up',
      response: 'md',
      color: 'primary',
    });

    signinButton.node.addEventListener('click', () => {
      this.authPopup.activeTab = 'Register';
      this.authPopup.render();
      this.portal.mount(this.authPopup.node);
    });

    /** BURGER MENU */
    this.burgerMenu = new BurgerMenu({
      parentNode: null,
      isAuth: this.isAuth,
      onClose: () => this.portal.unmount(),
      onOpenAuth: (tab: AuthFormType) => {
        this.authPopup.activeTab = tab;
        this.authPopup.render();
        this.portal.mount(this.authPopup.node);
      },
    });

    this.burgerBtn = new Button({
      parentNode: this.node,
      color: 'light',
      leftIcon: 'burger',
      size: 'icon-md',
      className: 'header_burger_btn',
    });

    this.handleOpen = () => this.portal.mount(this.burgerMenu.node);
    this.burgerBtn.node.addEventListener('click', this.handleOpen);
  }

  destroy(): void {
    this.burgerBtn.node.removeEventListener('click', this.handleOpen);
    super.destroy();
  }
}
