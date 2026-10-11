import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthDialog } from '@components';
import type { AuthTabType, ComponentProps } from '@types';
import { LOGIN, REGISTER } from '@constants';
import * as utils from '@utils';

vi.spyOn(utils, 'validateField');

vi.mock('@components', async (importOriginal) => {
  const actual = await importOriginal();

  class ComponentMock {
    node: HTMLElement;

    constructor({ parentNode, tagName = 'div', className, attrs, content }: ComponentProps) {
      this.node = document.createElement(tagName ?? 'div');
      if (className) {
        this.node.className = Array.isArray(className) ? className.join(' ') : className;
      }
      if (attrs) {
        attrs.forEach((a) => this.node.setAttribute(a.attr, a.value as string));
      }
      if (content) {
        this.node.textContent = content as string;
      }
      parentNode?.append(this.node);
    }

    destroy() {
      this.node.remove();
    }
  }

  return {
    ...(actual as {}),
    Component: ComponentMock,
  };
});

vi.mock('@ui', () => {
  return {
    Input: class InputMock {
      node = document.createElement('div');
      input = document.createElement('input');
      error = '';

      constructor({ parentNode, name }: { parentNode: HTMLElement; name: string }) {
        this.node.className = 'input';
        this.input.setAttribute('name', name);
        this.node.append(this.input);
        parentNode.append(this.node);
      }

      getInput() {
        return { node: this.input };
      }

      setError(msg: string) {
        this.error = msg;
      }

      setDisabled() {}
      destroy() {}
    },

    Button: class ButtonMock {
      node = document.createElement('button');
      disabled = false;
      loading = false;

      constructor({
        parentNode,
        className,
        text,
      }: {
        parentNode: HTMLElement;
        className?: string;
        text?: string;
      }) {
        this.node.className = className ?? '';
        this.node.textContent = text ?? '';
        parentNode.append(this.node);
      }

      setDisabled(v: boolean) {
        this.disabled = v;
      }

      setLoading(v: boolean) {
        this.loading = v;
      }
    },

    Switcher: class SwitcherMock {
      node = document.createElement('div');
      disabled = false;
      onChange: ((tab: string) => void) | null = null;

      constructor({
        parentNode,
        onChange,
      }: {
        parentNode: HTMLElement;
        onChange: (tab: string) => void;
      }) {
        this.onChange = onChange;
        parentNode.append(this.node);
        this.node.onclick = () => {
          this.onChange?.(REGISTER);
        };
      }

      setDisabled(v: boolean) {
        this.disabled = v;
      }

      destroy() {}
    },

    ErrorBanner: class ErrorBannerMock {
      node = document.createElement('div');

      constructor({ parentNode, message }: { parentNode: HTMLElement; message: string }) {
        this.node.textContent = message;
        parentNode.append(this.node);
      }

      destroy() {
        this.node.remove();
      }
    },
  };
});

describe('AuthDialog', () => {
  let root: HTMLElement;
  let onOpenAuthDialog: (tab: AuthTabType) => void;
  let onSubmit: (email: string, password: string, username?: string) => void;
  let onGoogleSubmit: () => void;

  beforeEach(() => {
    root = document.createElement('div');
    onOpenAuthDialog = vi.fn();
    onSubmit = vi.fn();
    onGoogleSubmit = vi.fn();
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    new AuthDialog({
      parentNode: root,
      tab: LOGIN,
      onOpenAuthDialog,
      onSubmit,
      onGoogleSubmit,
      onClose: () => {},
    });

    expect(root.querySelector('.app-auth-dialog')).toBeDefined();
    expect(root.querySelector('form#loginForm')).toBeDefined();
  });

  it('renders register form', () => {
    new AuthDialog({
      parentNode: root,
      tab: REGISTER,
      onOpenAuthDialog,
      onSubmit,
      onGoogleSubmit,
      onClose: () => {},
    });

    expect(root.querySelector('form#registerForm')).toBeDefined();
  });

  it('validates fields on input', () => {
    new AuthDialog({
      parentNode: root,
      tab: LOGIN,
      onOpenAuthDialog,
      onSubmit,
      onGoogleSubmit,
      onClose: () => {},
    });

    const emailInput = root.querySelector('input[name="email"]') as HTMLInputElement;
    emailInput.value = 'wrong';
    emailInput.dispatchEvent(new Event('input'));

    expect(utils.validateField).toHaveBeenCalled();
  });

  it('calls onSubmit with correct values', () => {
    new AuthDialog({
      parentNode: root,
      tab: LOGIN,
      onOpenAuthDialog,
      onSubmit,
      onGoogleSubmit,
      onClose: () => {},
    });

    const emailInput = root.querySelector('input[name="email"]') as HTMLInputElement;
    const passwordInput = root.querySelector('input[name="password"]') as HTMLInputElement;

    emailInput.value = 'test@mail.com';
    passwordInput.value = '123456';

    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    const submitBtn = root.querySelector('.app-auth-dialog_button-wrap_submit')!;
    submitBtn.dispatchEvent(new Event('click'));

    expect(onSubmit).toHaveBeenCalledWith('test@mail.com', '123456', undefined);
  });

  it('calls onGoogleSubmit', () => {
    new AuthDialog({
      parentNode: root,
      tab: LOGIN,
      onOpenAuthDialog,
      onSubmit,
      onGoogleSubmit,
      onClose: () => {},
    });

    const googleBtn = root.querySelector('.app-auth-dialog_google_btn')!;
    googleBtn.dispatchEvent(new Event('click'));

    expect(onGoogleSubmit).toHaveBeenCalled();
  });

  it('switcher triggers onOpenAuthDialog', () => {
    const dialog = new AuthDialog({
      parentNode: root,
      tab: LOGIN,
      onOpenAuthDialog,
      onSubmit,
      onGoogleSubmit,
      onClose: () => {},
    });

    dialog.switcher.node.dispatchEvent(new Event('click'));

    expect(onOpenAuthDialog).toHaveBeenCalled();
  });

  it('setError shows banner', () => {
    const dialog = new AuthDialog({
      parentNode: root,
      tab: LOGIN,
      onOpenAuthDialog,
      onSubmit,
      onGoogleSubmit,
      onClose: () => {},
    });

    dialog.setError('Wrong credentials');

    expect(root.querySelector('.app-auth-dialog_error-banner')).toBeDefined();
  });

  it('setPending disables inputs and buttons', () => {
    const dialog = new AuthDialog({
      parentNode: root,
      tab: LOGIN,
      onOpenAuthDialog,
      onSubmit,
      onGoogleSubmit,
      onClose: () => {},
    });

    dialog.setPending(true);

    const switcherSpy = vi.spyOn(dialog.switcher, 'setDisabled');
    const authSpy = vi.spyOn(dialog.authBtn, 'setLoading');
    const googleSpy = vi.spyOn(dialog.googleBtn, 'setLoading');

    dialog.setPending(true);

    expect(switcherSpy).toHaveBeenCalledWith(true);
    expect(authSpy).toHaveBeenCalledWith(true);
    expect(googleSpy).toHaveBeenCalledWith(true);
  });
});
