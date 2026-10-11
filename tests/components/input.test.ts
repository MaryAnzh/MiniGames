import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Input } from '@ui';
import type { ComponentProps } from '@types';

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
        attrs.forEach((a: any) => this.node.setAttribute(a.attr, a.value));
      }

      if (content) {
        this.node.textContent = content as string;
      }

      parentNode?.append(this.node);
    }

    setContent(text: string) {
      this.node.textContent = text;
    }

    setAttributes(attrs: any[]) {
      attrs.forEach((a) => {
        if (a.value === null) {
          this.node.removeAttribute(a.attr);
        } else {
          this.node.setAttribute(a.attr, a.value);
        }
      });
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

vi.mock('@ui', async (importOriginal) => {
  const actual = await importOriginal();

  class GoogleIcon {
    node = document.createElement('span');
    constructor({ parentNode, iconName, iconClass }: any) {
      this.node.setAttribute('data-google-icon', iconName);
      if (iconClass) this.node.className = iconClass;
      parentNode?.append(this.node);
    }
    destroy() {
      this.node.remove();
    }
  }

  return {
    ...(actual as {}),
    GoogleIcon,
  };
});

vi.mock('@constants', async (importOriginal) => {
  const actual = await importOriginal();

  const ICON_PICKER = {
    info: '<svg class="svg-info"></svg>',
    arrow_right: '<svg class="svg-arrow_right"></svg>',
    arrow_down: '<svg class="svg-arrow_down"></svg>',
  };

  const INPUT_TYPES = {
    PASSWORD: 'password',
    TEXT: 'text',
  };

  return {
    ...(actual as {}),
    ICON_PICKER,
    INPUT_TYPES,
  };
});

describe('Input component', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  it('renders label and input', () => {
    new Input({
      parentNode: root,
      label: 'Email',
      placeholder: 'Enter email',
      id: 'email',
      name: 'email',
    });

    expect(root.querySelector('label')).toBeDefined();
    expect(root.querySelector('input')).toBeDefined();
    expect(root.querySelector('label')?.textContent).toBe('Email');
    expect(root.querySelector('input')?.getAttribute('placeholder')).toBe('Enter email');
  });

  it('renders left google icon', () => {
    new Input({
      parentNode: root,
      label: 'User',
      placeholder: 'Name',
      id: 'name',
      name: 'name',
      leftIcon: 'google',
    });

    expect(root.querySelector('[data-google-icon="google"]')).toBeDefined();
  });

  it('renders right icon button for password type', () => {
    new Input({
      parentNode: root,
      label: 'Password',
      placeholder: 'Enter password',
      id: 'pass',
      name: 'pass',
      type: 'password',
      rightIcon: 'visibility',
    });

    expect(root.querySelector('.app_input_right-icon')).toBeDefined();
  });

  it('changePasswordVisibility toggles input type and icon', () => {
    const input = new Input({
      parentNode: root,
      label: 'Password',
      placeholder: 'Enter password',
      id: 'pass',
      name: 'pass',
      type: 'password',
      rightIcon: 'visibility',
    });

    const inputEl = root.querySelector('input') as HTMLInputElement;

    expect(inputEl.type).toBe('password');

    input.changePasswordVisibility();
    expect(inputEl.type).toBe('text');
    expect(root.querySelector('[data-google-icon="visibility"]')).toBeDefined();

    input.changePasswordVisibility();
    expect(inputEl.type).toBe('password');
    expect(root.querySelector('[data-google-icon="visibility_off"]')).toBeDefined();
  });

  it('setError shows and hides error state', () => {
    const input = new Input({
      parentNode: root,
      label: 'Email',
      placeholder: 'Enter email',
      id: 'email',
      name: 'email',
    });

    const wrap = root.querySelector('.app_input_wrap')!;
    const error = root.querySelector('.app_input_error')!;

    input.setError('Invalid email');

    expect(error.textContent).toBe('Invalid email');
    expect(wrap.classList.contains('has-error')).toBe(true);
    expect(error.classList.contains('visible')).toBe(true);

    input.setError('');

    expect(wrap.classList.contains('has-error')).toBe(false);
    expect(error.classList.contains('visible')).toBe(false);
  });

  it('setDisabled disables input and rightIcon button', () => {
    const input = new Input({
      parentNode: root,
      label: 'Password',
      placeholder: 'Enter password',
      id: 'pass',
      name: 'pass',
      type: 'password',
      rightIcon: 'visibility',
    });

    const inputEl = root.querySelector('input')!;
    const wrap = root.querySelector('.app_input_wrap')!;
    const rightBtn = root.querySelector('.app_input_right-icon')!;

    input.setDisabled(true);

    expect(inputEl.getAttribute('disabled')).toBe('true');
    expect(wrap.classList.contains('input-disabled')).toBe(true);
    expect(rightBtn.getAttribute('disabled')).toBe('true');

    input.setDisabled(false);

    expect(inputEl.hasAttribute('disabled')).toBe(false);
    expect(wrap.classList.contains('input-disabled')).toBe(false);
    expect(rightBtn.hasAttribute('disabled')).toBe(false);
  });

  it('getInput returns Component instance', () => {
    const input = new Input({
      parentNode: root,
      label: 'Email',
      placeholder: 'Enter email',
      id: 'email',
      name: 'email',
    });

    const inputNode = input.getInput();
    expect(inputNode).toBeDefined();
    expect(inputNode.node.tagName.toLowerCase()).toBe('input');
  });
});
