import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { InfoSection, MetaSection } from 'src/components/dialogs/game-details/sections';
import { SUCCESS } from '@constants';
import { appStore } from '@store';

vi.mock('@store', () => ({
  appStore: {
    isAuth: true,
    toggleFavorite: vi.fn(),
    showSnack: vi.fn(),
  },
}));

vi.mock('@components', async (importOriginal) => {
  const actual = await importOriginal();

  class ComponentMock {
    node: HTMLElement;

    constructor({ parentNode, tagName = 'div', className, content }: any) {
      this.node = document.createElement(tagName);
      if (className) this.node.className = className;
      if (content) this.node.textContent = content;
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
    Button: class {
      node = document.createElement('button');
      constructor({ parentNode, className, text }: any) {
        this.node.className = className ?? '';
        this.node.textContent = text ?? '';
        parentNode.append(this.node);
      }
      setAttributes() {}
    },

    LikeButton: class {
      node = document.createElement('button');
      loading = false;
      liked = false;
      count = 0;

      constructor({ parentNode, callback, value, isFavorite }: any) {
        this.node.className = 'like-button';
        this.count = value;
        this.liked = isFavorite;
        this.node.onclick = callback;
        parentNode.append(this.node);
      }

      setLoading(v: boolean) {
        this.loading = v;
      }

      setLiked(v: boolean) {
        this.liked = v;
      }

      setCount(v: number) {
        this.count = v;
      }

      setAttributes() {}
    },

    Skeleton: class {
      node = document.createElement('div');
      constructor({ parentNode, className }: any) {
        this.node.className = className;
        parentNode.append(this.node);
      }
    },

    SkeletonText: class {
      node = document.createElement('div');
      constructor({ parentNode, className }: any) {
        this.node.className = className;
        parentNode.append(this.node);
      }
    },

    Icon: class {
      node = document.createElement('span');
      constructor({ parentNode }: any) {
        this.node.className = 'icon-star';
        parentNode.append(this.node);
      }
    },
  };
});

describe('InfoSection', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  const baseInfo = {
    name: 'Test Game',
    fullDescription: 'Great game',
    specs: {
      genre: 'Action',
      players: '1-4',
      duration: '30m',
      price: '$10',
    },
    likesCount: 10,
    isLikedByCurrentUser: false,
    rating: 4.5,
    slug: 'test-game',
  };

  it('renders skeleton mode', () => {
    new InfoSection({
      parentNode: root,
      isSkeleton: true,
      ...baseInfo,
    });

    expect(root.querySelector('.game-detail_info_title-skeleton')).toBeDefined();
    expect(root.querySelector('.game-detail_info_desc-skeleton')).toBeDefined();
    expect(root.querySelector('.game-detail_info_widget-skeleton')).toBeDefined();
  });

  it('renders full info', () => {
    new InfoSection({
      parentNode: root,
      isSkeleton: false,
      ...baseInfo,
    });

    expect(root.querySelector('.game-detail_info_title-wrap_title')?.textContent).toBe('Test Game');
    expect(root.querySelector('.game-detail_info_desc')?.textContent).toBe('Great game');

    const widgets = root.querySelectorAll('.game-detail_info_widgets-wrap_widget');
    expect(widgets.length).toBe(4);
  });

  it('renders MetaSection inside', () => {
    new InfoSection({
      parentNode: root,
      isSkeleton: false,
      ...baseInfo,
    });

    expect(root.querySelector('.game-detail_meta')).toBeDefined();
    expect(root.querySelector('.like-button')).toBeDefined();
  });

  it('calls toggleFavorite when like clicked', async () => {
    (appStore.toggleFavorite as Mock).mockResolvedValue({
      status: SUCCESS,
      data: { isFavorited: true, likesCount: 11 },
    });

    new InfoSection({
      parentNode: root,
      isSkeleton: false,
      ...baseInfo,
    });

    const likeBtn = root.querySelector('.like-button')!;
    likeBtn.dispatchEvent(new Event('click'));

    expect(appStore.toggleFavorite).toHaveBeenCalledWith('test-game');
  });
});

describe('MetaSection', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  it('renders skeleton', () => {
    new MetaSection({
      parentNode: root,
      rating: 4.5,
      likesCount: 10,
      isSkeleton: true,
      isLikedByCurrentUser: false,
    });

    expect(root.querySelector('.game-detail_meta_rating-skeleton')).toBeDefined();
    expect(root.querySelector('.game-detail_meta_likes-skeleton')).toBeDefined();
  });

  it('renders rating and like button', () => {
    new MetaSection({
      parentNode: root,
      rating: 4.5,
      likesCount: 10,
      isSkeleton: false,
      isLikedByCurrentUser: false,
    });

    expect(root.querySelector('.icon-star')).toBeDefined();
    expect(root.querySelector('.like-button')).toBeDefined();
  });

  it('calls onLike when clicked', () => {
    const onLike = vi.fn();

    new MetaSection({
      parentNode: root,
      rating: 4.5,
      likesCount: 10,
      isSkeleton: false,
      isLikedByCurrentUser: false,
      onLike,
    });

    const likeBtn = root.querySelector('.like-button')!;
    likeBtn.dispatchEvent(new Event('click'));

    expect(onLike).toHaveBeenCalled();
  });
});
