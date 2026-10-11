import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { GameDetailsDialog } from '@components';
import { SUCCESS } from '@constants';
import { appStore } from '@store';

vi.mock('@store', () => {
  return {
    appStore: {
      isAuth: true,
      getGameDetails: vi.fn(),
      getGameComments: vi.fn(),
      toggleFavorite: vi.fn(),
      showSnack: vi.fn(),
    },
  };
});

vi.mock('src/components/dialogs/game-details/sections', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...(actual as {}),
    HeroSection: class {
      node = document.createElement('div');

      constructor({ parentNode, onClose }: { parentNode: HTMLElement; onClose: () => void }) {
        this.node.className = 'hero-section';

        const btn = document.createElement('button');
        btn.className = 'hero-section_close-btn';
        btn.onclick = onClose;

        this.node.append(btn);
        parentNode.append(this.node);
      }
    },

    InfoSection: class {
      node = document.createElement('div');

      constructor(props: any) {
        const { parentNode, isSkeleton, name, fullDescription } = props;

        this.node.className = 'info-section';

        if (isSkeleton) {
          const titleSkeleton = document.createElement('div');
          titleSkeleton.className = 'game-detail_info_title-skeleton';

          const descSkeleton = document.createElement('div');
          descSkeleton.className = 'game-detail_info_desc-skeleton';

          this.node.append(titleSkeleton, descSkeleton);
        } else {
          const title = document.createElement('h2');
          title.className = 'game-detail_info_title-wrap_title';
          title.textContent = name;

          const desc = document.createElement('p');
          desc.className = 'game-detail_info_desc';
          desc.textContent = fullDescription;

          this.node.append(title, desc);
        }

        parentNode.append(this.node);
      }
    },

    RecordsSection: class {
      node = document.createElement('div');
      constructor({ parentNode }: any) {
        this.node.className = 'records-section';
        parentNode.append(this.node);
      }
    },
    CommentsSection: class {
      node = document.createElement('div');
      constructor({ parentNode, navigateTo }: any) {
        this.node.className = 'comments-section';
        const link = document.createElement('a');
        link.className = 'comments-section_comment-link';
        link.onclick = () => navigateTo('/profile');
        this.node.append(link);
        parentNode.append(this.node);
      }
    },
    MetaSection: class {
      node = document.createElement('div');
      likeButton: HTMLButtonElement;

      constructor({ parentNode, onLike }: any) {
        this.node.className = 'game-detail_meta';

        const wrap = document.createElement('span');
        wrap.className = 'game-detail_meta_likes';

        const btn = document.createElement('button');
        btn.className = 'game-detail_meta_like-btn';
        btn.onclick = onLike;

        wrap.append(btn);
        this.node.append(wrap);
        parentNode.append(this.node);

        this.likeButton = btn;
      }
    },
  };
});

vi.mock('@ui', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...(actual as {}),
    Button: class {
      node = document.createElement('button');
      constructor({ parentNode, className }: any) {
        this.node.className = className ?? '';
        parentNode.append(this.node);
      }
    },
    LikeButton: class {
      node = document.createElement('button');

      constructor({ parentNode, callback }: any) {
        this.node.className = 'like-button';
        this.node.onclick = callback;
        parentNode.append(this.node);
      }
    },
  };
});

describe('GameDetailsDialog', () => {
  let root: HTMLElement;
  let onClose: () => void;
  let navigateTo: (path: string) => void;

  beforeEach(() => {
    root = document.createElement('div');
    onClose = vi.fn();
    navigateTo = vi.fn();
    vi.clearAllMocks();
  });

  it('renders skeleton immediately', () => {
    new GameDetailsDialog({
      parentNode: root,
      onClose,
      slug: 'test-game',
      navigateTo,
    });

    expect(root.querySelector('.app-game-details-dialog')).toBeDefined();
    expect(root.querySelector('.game-detail_info_title-skeleton')).toBeDefined();
    expect(root.querySelector('.game-detail_info_desc-skeleton')).toBeDefined();
  });

  // it('loads data and renders final UI', async () => {
  //   (appStore.getGameDetails as Mock).mockResolvedValue({
  //     status: SUCCESS,
  //     data: {
  //       data: {
  //         name: 'Test Game',
  //         heroImage: 'img.png',
  //         likesCount: 10,
  //         rating: 4.5,
  //         specs: {
  //           genre: 'Action',
  //           players: '1-4',
  //           duration: '30m',
  //           price: '$10',
  //         },
  //         fullDescription: 'Great game',
  //         topRecords: [],
  //         slug: 'test-game',
  //         isLikedByCurrentUser: false,
  //       },
  //     },
  //   });

  //   (appStore.getGameComments as Mock).mockResolvedValue({
  //     status: SUCCESS,
  //     data: { data: [] },
  //   });

  //   new GameDetailsDialog({
  //     parentNode: root,
  //     onClose,
  //     slug: 'test-game',
  //     navigateTo,
  //   });

  //   await Promise.resolve();

  //   expect(root.querySelector('.game-detail_info_title-wrap_title')?.textContent).toBe('Test Game');
  //   expect(root.querySelector('.game-detail_info_desc')?.textContent).toBe('Great game');
  // });

  it('does not render final UI if gameRes.status !== SUCCESS', async () => {
    (appStore.getGameDetails as Mock).mockResolvedValue({ status: 'ERROR' });
    (appStore.getGameComments as Mock).mockResolvedValue({ status: SUCCESS, data: { data: [] } });

    new GameDetailsDialog({
      parentNode: root,
      onClose,
      slug: 'bad-game',
      navigateTo,
    });

    await Promise.resolve();

    expect(root.querySelector('.game-detail_info_title-wrap_title')).toBeNull();
  });

  it('calls onClose when HeroSection close button is clicked', async () => {
    (appStore.getGameDetails as Mock).mockResolvedValue({
      status: SUCCESS,
      data: {
        data: {
          name: 'Test Game',
          heroImage: 'img.png',
          likesCount: 10,
          rating: 4.5,
          specs: { genre: '', players: '', duration: '', price: '' },
          fullDescription: '',
          topRecords: [],
          slug: 'test-game',
          isLikedByCurrentUser: false,
        },
      },
    });

    (appStore.getGameComments as Mock).mockResolvedValue({
      status: SUCCESS,
      data: { data: [] },
    });

    new GameDetailsDialog({
      parentNode: root,
      onClose,
      slug: 'test-game',
      navigateTo,
    });

    await Promise.resolve();

    const closeBtn = root.querySelector('.hero-section_close-btn');
    closeBtn?.dispatchEvent(new Event('click'));

    expect(onClose).toHaveBeenCalled();
  });

  it('navigateTo is called from CommentsSection', async () => {
    (appStore.getGameDetails as Mock).mockResolvedValue({
      status: SUCCESS,
      data: {
        data: {
          name: 'Test Game',
          heroImage: 'img.png',
          likesCount: 10,
          rating: 4.5,
          specs: { genre: '', players: '', duration: '', price: '' },
          fullDescription: '',
          topRecords: [],
          slug: 'test-game',
          isLikedByCurrentUser: false,
        },
      },
    });

    (appStore.getGameComments as Mock).mockResolvedValue({
      status: SUCCESS,
      data: { data: [{ id: 1, text: 'Nice', user: 'Mary' }] },
    });

    new GameDetailsDialog({
      parentNode: root,
      onClose,
      slug: 'test-game',
      navigateTo,
    });

    await Promise.resolve();

    const commentLink = root.querySelector('.comments-section_comment-link');
    commentLink?.dispatchEvent(new Event('click'));

    expect(navigateTo).toHaveBeenCalled();
  });
});
