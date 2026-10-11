import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { CommentsSection } from 'src/components/dialogs/game-details/sections';
import { appStore } from '@store';
import { SUCCESS } from '@constants';

vi.mock('@store', () => ({
  appStore: {
    isAuth: true,
    username: 'Mary',
    showSnack: vi.fn(),
    postComment: vi.fn(),
    getGameComments: vi.fn(),
    toggleCommentLike: vi.fn(),
  },
}));

vi.mock('@components', () => {
  return {
    Component: class {
      node: HTMLElement;
      constructor({ parentNode, tagName = 'div', className, content }: any) {
        this.node = document.createElement(tagName);
        if (className) this.node.className = className;
        if (content) this.node.textContent = content;
        parentNode?.append(this.node);
      }
    },
  };
});

vi.mock('@ui', () => {
  return {
    Button: class {
      node = document.createElement('button');
      constructor({ parentNode, className, disabled }: any) {
        this.node.className = className ?? '';
        this.node.disabled = disabled ?? false;
        parentNode.append(this.node);
      }
      setDisabled(v: boolean) {
        this.node.disabled = v;
      }
    },

    LikeButton: class {
      node = document.createElement('button');
      constructor({ parentNode, callback }: any) {
        this.node.className = 'comment-like-btn';
        this.node.onclick = callback;
        parentNode.append(this.node);
      }
      setLoading() {}
      setLiked() {}
      setCount() {}
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
  };
});

describe('CommentsSection', () => {
  let root: HTMLElement;
  let navigateTo: (path: string) => void;

  beforeEach(() => {
    root = document.createElement('div');
    navigateTo = vi.fn();
    vi.clearAllMocks();
  });

  const comments = [
    {
      commentId: '1',
      authorName: 'Mary',
      text: 'Nice game!',
      likesCount: 3,
      isLikedByCurrentUser: false,
      createdAt: '2024-01-01',
    },
    {
      commentId: '2',
      authorName: 'Alex',
      text: 'Cool!',
      likesCount: 1,
      isLikedByCurrentUser: true,
      createdAt: '2024-01-02',
    },
  ];

  it('renders skeleton mode', () => {
    new CommentsSection({
      parentNode: root,
      comments: [],
      isSkeleton: true,
      slug: 'game-1',
      navigateTo,
    });

    expect(root.querySelector('.game-details-comments_title-skeleton')).toBeDefined();
    expect(root.querySelector('.game-details-comments_new-avatar-skeleton')).toBeDefined();
    expect(root.querySelector('.game-details-comments_card-skeleton')).toBeDefined();
  });

  it('renders empty state when no comments', () => {
    new CommentsSection({
      parentNode: root,
      comments: [],
      slug: 'game-1',
      navigateTo,
    });

    expect(root.querySelector('.game-details-comments_empty')?.textContent).toBe(
      'No comments yet. Be the first!',
    );
  });

  it('renders comments list', () => {
    new CommentsSection({
      parentNode: root,
      comments,
      slug: 'game-1',
      navigateTo,
    });

    const items = root.querySelectorAll('.game-details-comments_card');
    expect(items.length).toBe(2);

    expect(items[0].textContent).toContain('Nice game!');
    expect(items[1].textContent).toContain('Cool!');
  });

  it('navigates to login when liking while unauthenticated', async () => {
    appStore.isAuth = false;

    new CommentsSection({
      parentNode: root,
      comments,
      slug: 'game-1',
      navigateTo,
    });

    const likeBtn = root.querySelector('.comment-like-btn')!;
    likeBtn.dispatchEvent(new Event('click'));

    expect(navigateTo).toHaveBeenCalled();
    expect(appStore.showSnack).toHaveBeenCalled();
  });

  it('calls toggleCommentLike when like clicked', async () => {
    appStore.isAuth = true;

    (appStore.toggleCommentLike as Mock).mockResolvedValue({
      status: SUCCESS,
      data: { isLikedByCurrentUser: true, likesCount: 4 },
    });

    new CommentsSection({
      parentNode: root,
      comments,
      slug: 'game-1',
      navigateTo,
    });

    const likeBtn = root.querySelector('.comment-like-btn')!;
    likeBtn.dispatchEvent(new Event('click'));

    expect(appStore.toggleCommentLike).toHaveBeenCalledWith('1');
  });

  it('shows error when comment too short', () => {
    new CommentsSection({
      parentNode: root,
      comments,
      slug: 'game-1',
      navigateTo,
    });

    const textarea = root.querySelector('.game-details-comments_textarea')! as HTMLTextAreaElement;
    textarea.value = ' ';
    textarea.dispatchEvent(new Event('input'));

    const sendBtn = root.querySelector('.game-details-comments_new-send')!;
    sendBtn.dispatchEvent(new Event('click'));

    expect(appStore.showSnack).toHaveBeenCalledWith('Comment must be 1–500 characters', 'error');
  });
});
