import { USER } from '@constants';

export function getAvatarLetters(name: string) {
  if (!name) return '';
  const clean = name.trim();
  const parts = clean.split('_');

  const firstCheck = parts[0].match(/[A-ZА-Я]/g);
  if (firstCheck && firstCheck.length >= 2) {
    return (firstCheck[0] + firstCheck[1]).toUpperCase();
  }

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  const capitals = clean.match(/[A-ZА-Я]/g);
  if (capitals && capitals.length >= 2) {
    return (capitals[0] + capitals[1]).toUpperCase();
  }

  return clean.slice(0, 2).toUpperCase();
}

export function replaceImageToWebp(url: string): string {
  const u = new URL(url, window.location.origin);
  const parts = u.pathname.split('.');
  parts[parts.length - 1] = 'webp';
  u.pathname = parts.join('.');
  return u.toString();
}

export function capitalizeFirst(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getInitials(name: string): string {
  const clean = name.trim();
  if (!clean) return '';

  const parts = clean.split(/\s+/);

  const extract = (word: string) => {
    const m = word.match(/[A-Za-zА-Яа-я0-9]/u);
    return m ? m[0].toUpperCase() : '';
  };

  if (parts.length === 1) {
    return extract(parts[0]);
  }

  const first = extract(parts[0]);
  const second = extract(parts[1]);

  return (first + second).trim() || '';
}

export function getProfileName({ email, username }: { email: string; username: string }): string {
  if (username?.trim()) return username.trim();

  if (email?.includes('@')) return email.split('@')[0];

  return USER;
}
