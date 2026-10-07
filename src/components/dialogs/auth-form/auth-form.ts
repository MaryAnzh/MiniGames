import { Component } from '@components';
import { LIGHT, LOGIN, REGISTER, INPUT_TYPES } from '@constants';
import type { AuthTabType } from '@types';
import { Input, Button, Switcher, Spinner, ErrorBanner } from '@ui';

import type { AuthPopupProps } from './types';
import { LOGIN_FIELDS, REGISTER_FIELDS } from './constants';

import { validateField } from '@utils';

const { PASSWORD, EMAIL } = INPUT_TYPES;

export class AuthDialog extends Component {
  public activeTab: AuthTabType;

  private onOpenAuthDialog?: (tab: AuthTabType) => void;
  private onSubmit: (email: string, password: string, username?: string) => void;

  private fields: Record<string, string> = {};
  private errors: Record<string, string> = {};
  private inputs: Record<string, Input> = {};

  private authBtn!: Button;
  private switcher!: Switcher;
  private googleBtn!: Button;
  private bottomLink!: Component;

  private isPending = false;
  private errorMessage = '';
  private spinner!: Spinner;
  private errorBanner: ErrorBanner | null = null;
  private errorTimeout: number | null = null;

  constructor({ parentNode, tab, onOpenAuthDialog, onSubmit }: AuthPopupProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'app-auth-dialog',
    });

    this.activeTab = tab;
    this.onOpenAuthDialog = onOpenAuthDialog;
    this.onSubmit = onSubmit;

    this.resetState();
    this.render();
  }

  private resetState() {
    this.fields = {};
    this.errors = {};
    this.inputs = {};
    this.errorBanner = null;
    this.errorMessage = '';
  }

  private attachValidation(input: Input, name: string) {
    const inputElement = input.getInput().node as HTMLInputElement;

    inputElement.addEventListener('input', () => {
      this.fields[name] = inputElement.value;
      const error = validateField(this.activeTab, name, inputElement.value, this.fields);
      this.errors[name] = error;
      input.setError(error);
      this.validateForm();
    });

    inputElement.addEventListener('blur', () => {
      const error = validateField(this.activeTab, name, inputElement.value, this.fields);
      this.errors[name] = error;
      input.setError(error);
      this.validateForm();
    });
  }

  private validateForm() {
    const fields = this.activeTab === LOGIN ? LOGIN_FIELDS : REGISTER_FIELDS;

    fields.forEach((f) => {
      const value = this.fields[f.name] ?? '';
      const error = validateField(this.activeTab, f.name, value, this.fields);
      this.errors[f.name] = error;

      const input = this.inputs[f.name];
      input?.setError(error);
    });

    const hasErrors = Object.values(this.errors).some((e) => e);
    this.authBtn.setDisabled(hasErrors || this.isPending);
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
      text: isLogin ? 'Login' : 'Create Account',
      size: 'lg',
      color: 'primary',
      fullWidth: true,
      shadow: 'hard',
      className: 'app-auth-dialog_button-wrap_submit',
      ariaLabel: isLogin ? LOGIN : REGISTER,
      type: 'submit',
    });

    this.authBtn.setDisabled(true);
    this.authBtn.node.onclick = (e) => this.handleSubmit(e);

    this.spinner = new Spinner({
      parentNode: this.authBtn.node,
      size: 'sm',
      color: 'light',
      className: 'auth-spinner',
    });
    this.spinner.hide();

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

  private handleSubmit(e: PointerEvent) {
    e.preventDefault();

    const email = this.fields[EMAIL];
    const password = this.fields[PASSWORD];
    const username = this.fields.username;

    this.onSubmit(email, password, username);
  }

  public setPending(value: boolean) {
    this.isPending = value;

    if (value) {
      this.spinner.show();
      this.authBtn.setText('Loading...');
    } else {
      this.spinner.hide();
      this.authBtn.setText(this.activeTab === LOGIN ? 'Login' : 'Register');
    }

    Object.values(this.inputs).forEach((input) => input.setDisabled(value));
    this.authBtn.setDisabled(value);
    this.switcher.setDisabled(value);
  }

  public setError(message: string) {
    this.errorMessage = message;

    // Удаляем старый баннер
    if (this.errorBanner) {
      this.errorBanner.destroy();
    }

    // Создаём новый баннер
    this.errorBanner = new ErrorBanner({
      parentNode: this.node,
      message: this.errorMessage,
      className: 'app-auth-dialog_error-banner',
      onClose: () => this.closeErrorBanner(),
    });

    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }

    this.errorTimeout = window.setTimeout(() => {
      this.closeErrorBanner();
    }, 5000);
  }

  private closeErrorBanner() {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }

    if (this.errorBanner) {
      this.errorBanner.destroy();
      this.errorBanner = null;
    }

    this.errors = {};
    Object.values(this.inputs).forEach((input) => {
      input.setError('');
    });

    Object.keys(this.fields).forEach((key) => {
      this.fields[key] = '';
      const inputElement = this.inputs[key]?.getInput().node as HTMLInputElement;
      if (inputElement) inputElement.value = '';
    });

    this.validateForm();
  }

  destroy() {
    this.switcher.destroy();
    this.authBtn.node.onclick = null;
    this.googleBtn.node.onclick = null;
    this.bottomLink.node.onclick = null;
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }

    Object.values(this.inputs).forEach((input) => input.destroy());
    this.errorBanner?.destroy();
    super.destroy();
  }
}
