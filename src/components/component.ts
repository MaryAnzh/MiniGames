import type { ComponentAttributesType, ComponentProps } from '@types';

export class Component {
  public node: HTMLElement;

  constructor({ parentNode, tagName, className, content, attrs }: ComponentProps) {
    const element = document.createElement(tagName);

    // Classes
    if (Array.isArray(className)) {
      element.classList.add(...className);
    } else if (typeof className === 'string') {
      element.className = className;
    }

    // Content
    if (typeof content === 'string') {
      element.textContent = content;
    } else if (content instanceof HTMLElement) {
      element.append(content);
    } else if (Array.isArray(content)) {
      content.forEach((item) => {
        if (typeof item === 'string') {
          element.append(document.createTextNode(item));
        } else {
          element.append(item);
        }
      });
    }

    // Attributes
    if (attrs) {
      attrs.forEach(({ atr, value }) => {
        element.setAttribute(atr, value);
      });
    }

    // Append to parent
    if (parentNode) {
      parentNode.append(element);
    }

    this.node = element;
  }

  setAttributes(attrs: ComponentAttributesType[]) {
    attrs.forEach(({ atr, value }) => {
      this.node.setAttribute(atr, value);
    });
  }

  setContent(content: string | HTMLElement | (HTMLElement | string)[]) {
    this.node.innerHTML = '';

    if (typeof content === 'string') {
      this.node.textContent = content;
    } else if (content instanceof HTMLElement) {
      this.node.append(content);
    } else if (Array.isArray(content)) {
      content.forEach((item) => {
        if (typeof item === 'string') {
          this.node.append(document.createTextNode(item));
        } else {
          this.node.append(item);
        }
      });
    }
  }

  append(child: HTMLElement) {
    this.node.append(child);
  }

  destroy() {
    this.node.remove();
  }
}
