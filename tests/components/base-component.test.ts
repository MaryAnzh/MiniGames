import { describe, it, expect, beforeEach } from 'vitest';
import { Component } from '@components';

describe('Base Component class', () => {
  let parent: HTMLElement;

  beforeEach(() => {
    parent = document.createElement('div');
  });

  it('creates element with default tagName div', () => {
    const c = new Component({ parentNode: parent });
    expect(c.node.tagName.toLowerCase()).toBe('div');
    expect(parent.contains(c.node)).toBe(true);
  });

  it('creates element with custom tagName', () => {
    const c = new Component({ parentNode: parent, tagName: 'span' });
    expect(c.node.tagName.toLowerCase()).toBe('span');
  });

  it('applies className string', () => {
    const c = new Component({ parentNode: parent, className: 'test-class' });
    expect(c.node.className).toBe('test-class');
  });

  it('applies className array', () => {
    const c = new Component({
      parentNode: parent,
      className: ['a', 'b', ''],
    });
    expect(c.node.classList.contains('a')).toBe(true);
    expect(c.node.classList.contains('b')).toBe(true);
  });

  it('sets text content', () => {
    const c = new Component({ parentNode: parent, content: 'Hello' });
    expect(c.node.textContent).toBe('Hello');
  });

  it('sets HTMLElement content', () => {
    const el = document.createElement('span');
    el.textContent = 'child';
    const c = new Component({ parentNode: parent, content: el });
    expect(c.node.firstChild).toBe(el);
  });

  it('sets array content', () => {
    const el = document.createElement('span');
    el.textContent = 'child';
    const c = new Component({ parentNode: parent, content: ['a', el] });

    expect(c.node.childNodes.length).toBe(2);
    expect(c.node.childNodes[0].textContent).toBe('a');
    expect(c.node.childNodes[1]).toBe(el);
  });

  it('sets attributes', () => {
    const c = new Component({
      parentNode: parent,
      attrs: [
        { attr: 'id', value: 'test-id' },
        { attr: 'data-x', value: '123' },
      ],
    });

    expect(c.node.getAttribute('id')).toBe('test-id');
    expect(c.node.getAttribute('data-x')).toBe('123');
  });

  it('setAttributes adds and removes attributes', () => {
    const c = new Component({ parentNode: parent });

    c.setAttributes([
      { attr: 'data-a', value: '1' },
      { attr: 'data-b', value: null },
    ]);

    expect(c.node.getAttribute('data-a')).toBe('1');
    expect(c.node.hasAttribute('data-b')).toBe(false);
  });

  it('setContent replaces content', () => {
    const c = new Component({ parentNode: parent, content: 'old' });

    c.setContent('new');
    expect(c.node.textContent).toBe('new');
  });

  it('append adds child element', () => {
    const c = new Component({ parentNode: parent });
    const child = document.createElement('span');

    c.append(child);
    expect(c.node.lastChild).toBe(child);
  });

  it('removeOnclick removes onclick handler', () => {
    const c = new Component({ parentNode: parent });
    c.node.onclick = () => {};
    c.removeOnclick();
    expect(c.node.onclick).toBe(null);
  });

  it('destroy removes element from DOM', () => {
    const c = new Component({ parentNode: parent });
    c.destroy();
    expect(parent.contains(c.node)).toBe(false);
  });
});
