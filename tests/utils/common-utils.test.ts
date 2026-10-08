import { describe, test, expect, vi } from 'vitest';
import * as U from '@utils';

describe('Array: arrayFromNumber', () => {
  test('creates array from 0 by default', () => {
    expect(U.arrayFromNumber(5)).toEqual([0, 1, 2, 3, 4]);
  });

  test('creates array starting from custom value', () => {
    expect(U.arrayFromNumber(4, 10)).toEqual([10, 11, 12, 13]);
  });

  test('returns empty array for 0', () => {
    expect(U.arrayFromNumber(0)).toEqual([]);
  });
});

describe('Avatar: getRandomAvatarColor', () => {
  test('returns one of predefined colors', () => {
    const allowedTokens = [
      '--avatar-color-1',
      '--avatar-color-2',
      '--avatar-color-3',
      '--avatar-color-4',
      '--avatar-color-5',
    ];

    const result = U.getRandomAvatarColor();
    expect(allowedTokens).toContain(result.token);
    expect(result.hex).toMatch(/^#/);
  });
});

describe('Avatar: getAvatarLetters', () => {
  test('returns empty string for empty name', () => {
    expect(U.getAvatarLetters('')).toBe('');
  });

  test('two uppercase letters at start', () => {
    expect(U.getAvatarLetters('AbCd')).toBe('AC');
  });

  test('split by underscore and take first letters', () => {
    expect(U.getAvatarLetters('john_doe')).toBe('JD');
  });

  test('two capitals anywhere in string', () => {
    expect(U.getAvatarLetters('helloMAry')).toBe('MA');
  });

  test('fallback: first two letters uppercased', () => {
    expect(U.getAvatarLetters('alex')).toBe('AL');
  });

  test('handles trimming', () => {
    expect(U.getAvatarLetters('  anna_karenina  ')).toBe('AK');
  });
});

describe('Urls: replaceImageToWebp', () => {
  test('replaces extension with webp', () => {
    const url = U.replaceImageToWebp('https://site.com/images/photo.png');
    expect(url).toBe('https://site.com/images/photo.webp');
  });

  test('works with relative URLs', () => {
    const url = U.replaceImageToWebp('/assets/img/pic.jpg');
    expect(url.endsWith('pic.webp')).toBe(true);
  });
});

describe('String: capitalizeFirst', () => {
  test('capitalizes first letter', () => {
    expect(U.capitalizeFirst('hello')).toBe('Hello');
  });

  test('returns empty string for empty input', () => {
    expect(U.capitalizeFirst('')).toBe('');
  });

  test('works with single character', () => {
    expect(U.capitalizeFirst('a')).toBe('A');
  });

  test('does not change other characters', () => {
    expect(U.capitalizeFirst('world')).toBe('World');
  });
});
