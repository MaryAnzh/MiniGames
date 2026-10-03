const AVATAR_COLORS_MAP = [
  { token: '--avatar-color-1', hex: '#ffd02b' },
  { token: '--avatar-color-2', hex: '#a3e2c9' },
  { token: '--avatar-color-3', hex: '#bce3ff' },
  { token: '--avatar-color-4', hex: '#ffc6ff' },
  { token: '--avatar-color-5', hex: '#e8dff5' },
] as const;

export function getRandomAvatarColor() {
  const color = AVATAR_COLORS_MAP[Math.floor(Math.random() * AVATAR_COLORS_MAP.length)];
  console.log(color.token);
  return color;
}
