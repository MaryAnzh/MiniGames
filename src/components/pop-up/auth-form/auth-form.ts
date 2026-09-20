import { Component, Portal } from '@components';
import type { AuthFormType, ComponentProps, GoogleIconsType } from '@types';
import { Input, Button, Switcher } from '@ui';

type FieldType = {
  label: string;
  placeholder: string;
  iconName: GoogleIconsType;
  rightIcon?: GoogleIconsType;
  type?: string;
};

const LOGIN_FIELDS: FieldType[] = [
  {
    label: 'Email Address',
    placeholder: 'e.g. alex@minigames.com',
    type: 'email',
    iconName: 'mail',
  },
  {
    label: 'Password',
    placeholder: '••••••••',
    type: 'password',
    iconName: 'lock',
    rightIcon: 'visibility',
  },
];

const REGISTER_FIELDS: FieldType[] = [
  { label: 'Username', placeholder: 'e.g. CozyGamer_99', iconName: 'person' },
  { label: 'Email Address', placeholder: 'your.email@domain.com', type: 'email', iconName: 'mail' },
  { label: 'Password', placeholder: 'Min. 8 characters', type: 'password', iconName: 'lock' },
  {
    label: 'Confirm Password',
    placeholder: 'Repeat your password',
    type: 'password',
    iconName: 'visibility',
  },
];

type AuthPopupProps = Pick<ComponentProps, 'parentNode'> & {
  tab: AuthFormType;
};

export class AuthPopup extends Component {
  public activeTab: AuthFormType = 'Login';
  private portal: Portal;

  constructor({ parentNode, tab }: AuthPopupProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'auth_popup',
    });

    this.activeTab = tab;

    this.portal = new Portal({
      onClose: () => this.close(),
    });

    this.render();
  }

  open() {
    this.portal.mount(this.node);
  }

  close() {
    this.portal.unmount();
  }

  setTab(tab: AuthFormType) {
    this.activeTab = tab;
    this.render();
  }

  public render() {
    this.node.innerHTML = '';
    const isLogin = this.activeTab === 'Login';
    new Switcher({
      parentNode: this.node,
      tabs: ['Login', 'Register'],
      active: this.activeTab,
      onChange: (tab) => {
        this.setTab(tab as AuthFormType);
      },
    });

    const title = this.activeTab === 'Login' ? 'Welcome Back!' : 'Create Account';
    const subtitle =
      this.activeTab === 'Login'
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

    const fields = this.activeTab === 'Login' ? LOGIN_FIELDS : REGISTER_FIELDS;
    const fieldset = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'auth_fieldset',
    });

    fields.forEach((field) => {
      new Input({
        parentNode: fieldset.node,
        label: field.label,
        placeholder: field.placeholder,
        type: field.type,
        icon: field.iconName,
        rightIcon: field.rightIcon,
      });
    });

    if (isLogin) {
      new Component({
        parentNode: fieldset.node,
        tagName: 'span',
        content: 'Forgot Password?',
        className: 'auth_fieldset_forgot',
      });
    }
    const buttonWrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'auth_button-wrap',
    });

    new Button({
      parentNode: buttonWrap.node,
      text: isLogin ? 'Login' : 'Create Account',
      size: 'lg',
      colorVariant: 'primary',
      width: 'full',
      className: 'auth_main_btn',
    });

    new Component({
      parentNode: buttonWrap.node,
      tagName: 'div',
      className: 'auth_divider',
      content: 'OR',
    });

    new Button({
      parentNode: buttonWrap.node,
      text: isLogin ? 'Continue with Google' : 'Sign up with Google',
      size: 'pop-up',
      colorVariant: 'light',
      width: 'full',
      className: 'auth_google_btn',
      leftIcon: 'Google',
    });

    const footerText = isLogin ? "Don't have an account?" : 'Already have an account?';

    const footer = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'auth_footer',
    });
    new Component({
      parentNode: footer.node,
      tagName: 'span',
      className: 'auth_footer_text',
      content: footerText,
    });
    const bottomLink = new Component({
      parentNode: footer.node,
      tagName: 'span',
      className: 'auth_footer_link',
      content: isLogin ? 'Register' : 'Login',
    });

    bottomLink.node.addEventListener('click', () => {
      isLogin ? 'Register' : 'Login';
    });
  }
}
