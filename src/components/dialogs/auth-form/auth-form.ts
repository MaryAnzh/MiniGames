import { Component } from '@components';
import { LOGIN, REGISTER } from '@constants';
import type { AuthTabType, ComponentProps, GoogleIconsType } from '@types';
import { Input, Button, Switcher } from '@ui';

type FieldType = {
  label: string;
  placeholder: string;
  leftIcon: GoogleIconsType;
  rightIcon?: GoogleIconsType;
  type?: string;
  id: string;
  name: string;
};

const LOGIN_FIELDS: FieldType[] = [
  {
    label: 'Email Address',
    placeholder: 'e.g. alex@minigames.com',
    type: 'email',
    leftIcon: 'mail',
    id: 'loginEmail',
    name: 'login-email',
  },
  {
    label: 'Password',
    placeholder: '••••••••',
    type: 'password',
    leftIcon: 'lock',
    rightIcon: 'visibility',
    id: 'loginPass',
    name: 'login-pass',
  },
];

const REGISTER_FIELDS: FieldType[] = [
  {
    label: 'Username',
    placeholder: 'e.g. CozyGamer_99',
    leftIcon: 'person',
    id: 'registerUserName',
    name: 'register-user-name',
  },
  {
    label: 'Email Address',
    placeholder: 'your.email@domain.com',
    type: 'email',
    leftIcon: 'mail',
    id: 'registerEmail',
    name: 'register-email',
  },
  {
    label: 'Password',
    placeholder: 'Min. 8 characters',
    type: 'password',
    leftIcon: 'lock',
    id: 'registerPass',
    name: 'register-pass',
  },
  {
    label: 'Confirm Password',
    placeholder: 'Repeat your password',
    type: 'password',
    leftIcon: 'lock',
    id: 'registerPassRepeat',
    name: 'register-pass-repeat',
  },
];

type AuthPopupProps = Pick<ComponentProps, 'parentNode'> & {
  tab: AuthTabType;
  onOpenAuthDialog?: (tag: AuthTabType) => void;
};

export class AuthDialog extends Component {
  public activeTab: AuthTabType;
  private onOpenAuthDialog?: (tag: AuthTabType) => void;

  //buttons
  private loginBtn!: Button;
  private switcher!: Switcher;
  private googleBtn!: Button;
  private bottomLink!: Component;

  constructor({ parentNode, tab, onOpenAuthDialog }: AuthPopupProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'auth_popup',
    });

    this.activeTab = tab;
    this.onOpenAuthDialog = onOpenAuthDialog;

    this.render();
  }

  public render() {
    this.node.innerHTML = '';

    const isLogin = this.activeTab === LOGIN;

    this.switcher = new Switcher({
      parentNode: this.node,
      tabs: [LOGIN, REGISTER],
      active: this.activeTab,
      onChange: (tab) => {
        this.onOpenAuthDialog?.(tab);
      },
    });

    const title = isLogin ? 'Welcome Back!' : 'Create Account';
    const subtitle = isLogin
      ? 'Sign in to resume your games and progress.'
      : 'Join MiniGames to track your score & streak.';

    const heading = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'auth_heading',
    });

    new Component({
      parentNode: heading.node,
      tagName: 'h2',
      className: 'auth_heading_title',
      content: title,
    });

    new Component({
      parentNode: heading.node,
      tagName: 'p',
      className: 'auth_heading_subtitle',
      content: subtitle,
    });

    const authForm = new Component({
      parentNode: this.node,
      tagName: 'form',
      className: 'auth_form',
      attrs: [
        { attr: 'novalidate', value: '' },
        { attr: 'id', value: isLogin ? 'loginForm' : 'registerForm' },
      ],
    });

    const fields = isLogin ? LOGIN_FIELDS : REGISTER_FIELDS;

    fields.forEach((field) => {
      new Input({
        parentNode: authForm.node,
        ...field,
      });
    });

    if (isLogin) {
      new Component({
        parentNode: authForm.node,
        tagName: 'span',
        content: 'Forgot Password?',
        className: 'auth_form_forgot',
      });
    }

    const buttonWrap = new Component({
      parentNode: authForm.node,
      tagName: 'div',
      className: 'auth_button-wrap',
    });

    this.loginBtn = new Button({
      parentNode: buttonWrap.node,
      text: isLogin ? LOGIN : 'Create Account',
      size: 'lg',
      color: 'primary',
      fullWidth: true,
      shadow: 'hard',
      className: 'auth_main_btn',
      ariaLabel: isLogin ? LOGIN : REGISTER,
    });

    new Component({
      parentNode: buttonWrap.node,
      tagName: 'div',
      className: 'auth_divider',
      content: 'OR',
    });

    this.googleBtn = new Button({
      parentNode: buttonWrap.node,
      text: isLogin ? 'Continue with Google' : 'Sign up with Google',
      size: 'lg',
      color: 'light',
      fullWidth: true,
      className: 'auth_google_btn',
      leftIcon: 'google',
      ariaLabel: isLogin ? 'Continue with Google' : 'Sign up with Google',
    });

    const footer = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'auth_footer',
    });

    new Component({
      parentNode: footer.node,
      tagName: 'span',
      className: 'auth_footer_text',
      content: isLogin ? "Don't have an account?" : 'Already have an account?',
    });

    this.bottomLink = new Component({
      parentNode: footer.node,
      tagName: 'span',
      className: 'auth_footer_link',
      content: isLogin ? REGISTER : LOGIN,
    });

    this.bottomLink.node.onclick = () => {
      this.onOpenAuthDialog?.(isLogin ? REGISTER : LOGIN);
    };
  }

  destroy() {
    this.switcher.destroy();

    this.loginBtn.node.onclick = null;
    this.googleBtn.node.onclick = null;
    this.bottomLink.node.onclick = null;

    super.destroy();
  }
}
