import { Component } from '@components';
import { LIGHT, LOGIN, REGISTER, INPUT_TYPES } from '@constants';
import type { AuthTabType } from '@types';
import { Input, Button, Switcher } from '@ui';

import type { AuthPopupProps } from './types';
import { LOGIN_FIELDS, REGISTER_FIELDS } from './constants';
import appStore from '@store';

const { PASSWORD, EMAIL } = INPUT_TYPES;

export class AuthDialog extends Component {
  private store: typeof appStore;

  public activeTab: AuthTabType;
  private onOpenAuthDialog?: (tab: AuthTabType) => void;
  private onClose: () => void;

  private fields: Record<string, string> = {};
  private errors: Record<string, string> = {};
  private inputs: Record<string, Input> = {};

  private authBtn!: Button;
  private switcher!: Switcher;
  private googleBtn!: Button;
  private bottomLink!: Component;

  constructor({ parentNode, tab, onOpenAuthDialog, onClose }: AuthPopupProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'app-auth-dialog',
    });
    this.store = appStore;
    this.activeTab = tab;
    this.onOpenAuthDialog = onOpenAuthDialog;
    this.onClose = onClose;

    this.resetState();
    this.render();
  }

  private resetState() {
    this.fields = {};
    this.errors = {};
    this.inputs = {};
  }

  private validateField(name: string, value: string) {
    // EMAIL
    if (name === EMAIL) {
      if (!value) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Invalid email format';
      return '';
    }

    // USERNAME
    if (name === 'username') {
      if (!value) return 'Username is required';
      if (value.length < 2 || value.length > 30) return '2–30 characters required';
      if (!/^[A-Z][A-Za-z0-9]*$/.test(value))
        return 'Must start with uppercase and contain only letters/digits';
      return '';
    }

    // PASSWORD (login)
    if (name === PASSWORD && this.activeTab === LOGIN) {
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Minimum 6 characters';
      return '';
    }

    // PASSWORD (register)
    if (name === PASSWORD && this.activeTab === REGISTER) {
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Minimum 6 characters';
      if (!/[A-Z]/.test(value)) return 'Must contain uppercase letter';
      if (!/[0-9]/.test(value)) return 'Must contain a digit';
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Must contain a special character';
      return '';
    }

    // CONFIRM PASSWORD
    if (name === 'confirm') {
      if (!value) return 'Confirm your password';
      if (value !== this.fields.password) return 'Passwords do not match';
      return '';
    }

    return '';
  }

  private validateForm() {
    const fields = this.activeTab === LOGIN ? LOGIN_FIELDS : REGISTER_FIELDS;

    fields.forEach((f) => {
      const value = this.fields[f.name] ?? '';
      const error = this.validateField(f.name, value);
      this.errors[f.name] = error;

      const input = this.inputs[f.name];
      input?.setError(error);
    });

    const hasErrors = Object.values(this.errors).some((e) => e);
    this.authBtn.setDisabled(hasErrors);
  }

  private attachValidation(input: Input, name: string) {
    const inputElement = input.getInput().node as HTMLInputElement;

    inputElement.addEventListener('input', () => {
      this.fields[name] = inputElement.value;
      const error = this.validateField(name, inputElement.value);
      this.errors[name] = error;
      input.setError(error);
      this.validateForm();
    });

    inputElement.addEventListener('blur', () => {
      const error = this.validateField(name, inputElement.value);
      this.errors[name] = error;
      input.setError(error);
      this.validateForm();
    });
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
      className: 'app-auth-dialog_heading',
    });

    new Component({
      parentNode: heading.node,
      tagName: 'h2',
      className: 'app-auth-dialog_heading_title',
      content: title,
    });

    new Component({
      parentNode: heading.node,
      tagName: 'p',
      className: 'app-auth-dialog_heading_subtitle',
      content: subtitle,
    });

    const authForm = new Component({
      parentNode: this.node,
      tagName: 'form',
      className: 'app-auth-dialog_form',
      attrs: [
        { attr: 'novalidate', value: '' },
        { attr: 'id', value: isLogin ? 'loginForm' : 'registerForm' },
      ],
    });

    const fields = isLogin ? LOGIN_FIELDS : REGISTER_FIELDS;

    fields.forEach((field) => {
      const input = new Input({
        parentNode: authForm.node,
        ...field,
      });

      this.inputs[field.name] = input;

      this.attachValidation(input, field.name);
    });

    const buttonWrap = new Component({
      parentNode: authForm.node,
      tagName: 'div',
      className: 'app-auth-dialog_button-wrap',
    });

    this.authBtn = new Button({
      parentNode: buttonWrap.node,
      text: isLogin ? LOGIN : 'Create Account',
      size: 'lg',
      color: 'primary',
      fullWidth: true,
      shadow: 'hard',
      className: 'app-auth-dialog_main_btn',
      ariaLabel: isLogin ? LOGIN : REGISTER,
      type: 'submit',
    });
    this.authBtn.setDisabled(true);
    this.authBtn.node.onclick = (e) => this.handleSubmit(e);

    new Component({
      parentNode: buttonWrap.node,
      tagName: 'div',
      className: 'app-auth-dialog_divider',
      content: 'OR',
    });

    this.googleBtn = new Button({
      parentNode: buttonWrap.node,
      text: isLogin ? 'Continue with Google' : 'Sign up with Google',
      size: 'lg',
      color: LIGHT,
      fullWidth: true,
      className: 'app-auth-dialog_google_btn',
      leftIcon: 'google',
      ariaLabel: isLogin ? 'Continue with Google' : 'Sign up with Google',
    });

    const footer = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'app-auth-dialog_footer',
    });

    new Component({
      parentNode: footer.node,
      tagName: 'span',
      className: 'app-auth-dialog_footer_text',
      content: isLogin ? "Don't have an account?" : 'Already have an account?',
    });

    this.bottomLink = new Component({
      parentNode: footer.node,
      tagName: 'span',
      className: 'app-auth-dialog_footer_link',
      content: isLogin ? REGISTER : LOGIN,
    });

    this.bottomLink.node.onclick = () => {
      this.onOpenAuthDialog?.(isLogin ? REGISTER : LOGIN);
    };
  }

  private async handleSubmit(e: PointerEvent) {
    e.preventDefault();

    const email = this.fields[EMAIL];
    const password = this.fields[PASSWORD];

    if (this.activeTab === LOGIN) {
      await this.store.login(email, password);
      this.onClose();
    } else {
      const name = this.fields.username;

      await this.store.register(email, password, name);
      this.onClose();
    }
  }

  destroy() {
    this.switcher.destroy();
    this.authBtn.node.onclick = null;
    this.googleBtn.node.onclick = null;
    this.bottomLink.node.onclick = null;

    Object.values(this.inputs).forEach((input) => input.destroy());

    super.destroy();
  }
}
