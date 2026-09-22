export const APP_PAGES = [
  { name: 'Home', path: '/' },
  { name: 'Library', path: '/library' },
  { name: 'Tournaments', path: '/tournaments' },
  { name: 'Community', path: '/community' },
];

export const FOOTER_NAV = [
  { name: 'Home', path: '/' },
  { name: 'Library', path: '/library' },
  { name: 'Community', path: '/community' },
  { name: 'Tournaments', path: '/tournaments' },
];

export const APP_ROUTES = {
  HOME: '/',
  LIBRARY: '/library',
  TOURNAMENTS: '/tournaments',
  COMMUNITY: '/community',
} as const;

export const APP_COMPANY = [
  { name: 'About Us', path: '/' },
  { name: 'Contact', path: '/' },
  { name: 'Privacy Policy', path: '/' },
  { name: 'Terms of Service', path: '/' },
];

export const constAPP_LINKS_TITLES = {
  EXPLORE: 'Explore',
  COMPANY: 'Company',
  COMMUNITY: 'Community',
} as const;
export const { COMMUNITY, COMPANY, EXPLORE } = constAPP_LINKS_TITLES;
export const COMMUNITY_ICONS = [
  { googleIcon: 'share', path: '/', ariaLabel: 'Share content' },
  { googleIcon: 'chat', path: '/', ariaLabel: 'Open chat' },
  { googleIcon: 'rss_feed', path: '/', ariaLabel: 'Open news feed' },
] as const;
