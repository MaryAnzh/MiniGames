import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TableSection } from 'src/pages/home/components';
import { SUCCESS } from '@constants';
import type { LeaderBoardType } from '@types';

vi.mock('@components', () => {
  return {
    Component: class ComponentMock {
      public node: HTMLElement;

      constructor(props: {
        parentNode?: HTMLElement;
        tagName?: string;
        className?: string | string[];
        attrs?: { attr: string; value: string }[];
        content?: string;
      }) {
        const tag = props.tagName ?? 'div';
        this.node = document.createElement(tag);

        if (props.className) {
          this.node.className = Array.isArray(props.className)
            ? props.className.join(' ')
            : props.className;
        }

        if (props.attrs) {
          props.attrs.forEach(({ attr, value }) => {
            this.node.setAttribute(attr, value);
          });
        }

        if (props.content) {
          this.node.textContent = props.content;
        }

        props.parentNode?.append(this.node);
      }

      append(child: HTMLElement) {
        this.node.append(child);
      }

      destroy() {
        this.node.remove();
      }
    },
  };
});

describe('TableSection', () => {
  let root: HTMLElement;
  let onRetry: () => Promise<void>;

  beforeEach(() => {
    root = document.createElement('div');
    onRetry = vi.fn().mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  it('renders real rows when leaderboard has data', () => {
    const data: LeaderBoardType[] = [
      {
        favoriteGameName: 'Game',
        favoriteGameSlug: 'game',
        gamesPlayed: 10,
        playerName: 'Alice',
        rank: 1,
        streakDays: 3,
        totalScore: 100,
      },
    ];

    new TableSection({
      parentNode: root,
      status: SUCCESS,
      leaderBoard: data,
      onRetry,
    });

    const rows = root.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);

    const player = root.querySelector('.player-name');
    expect(player?.textContent).toBe('Alice');
  });

  it('handleRetry calls onRetry', async () => {
    const table = new TableSection({
      parentNode: root,
      status: SUCCESS,
      leaderBoard: [],
      onRetry,
    });

    await table['handleRetry']();
    expect(onRetry).toHaveBeenCalled();
  });

  it('destroy removes section', () => {
    const table = new TableSection({
      parentNode: root,
      status: SUCCESS,
      leaderBoard: [],
      onRetry,
    });

    table.destroy();
    expect(root.innerHTML).toBe('');
  });
});
