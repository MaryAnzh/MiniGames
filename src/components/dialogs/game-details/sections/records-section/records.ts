import { Component } from '@components';
import type { ComponentProps, GameRecord, TopRecordsType } from '@types';
import { Skeleton } from '@ui';
import { LIGHT } from '@constants';
import { arrayFromNumber } from '@utils';

type RecordsSectionProps = Pick<ComponentProps, 'parentNode'> & {
  records: TopRecordsType[];
  isSkeleton?: boolean;
};

export class RecordsSection extends Component {
  recordsRowCount = 4;

  constructor({ parentNode, records, isSkeleton = false }: RecordsSectionProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'game-detail_records',
    });

    this.render(records, isSkeleton);
  }

  private render(records: GameRecord[], isSkeleton: boolean) {
    const titleRow = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'game-detail_records_title-row',
    });

    if (isSkeleton) {
      new Skeleton({
        parentNode: titleRow.node,
        color: LIGHT,
        className: 'game-detail_records_title-skeleton',
      });
    } else {
      new Component({
        parentNode: titleRow.node,
        tagName: 'span',
        className: 'game-detail_records_icon',
        content: '🏆',
      });

      new Component({
        parentNode: titleRow.node,
        tagName: 'h3',
        className: 'game-detail_records_title',
        content: 'Top Records',
      });
    }

    const table = new Component({
      parentNode: this.node,
      tagName: 'table',
      className: 'game-detail_records_table',
    });

    const tbody = new Component({
      parentNode: table.node,
      tagName: 'tbody',
    });
    if (isSkeleton) {
      arrayFromNumber(this.recordsRowCount).map(() => {
        const tr = new Component({
          parentNode: tbody.node,
          tagName: 'tr',
          className: 'game-detail_records_row',
        });

        const leftTd = new Component({
          parentNode: tr.node,
          tagName: 'td',
          className: 'game-detail_records_left',
        });

        new Skeleton({
          parentNode: leftTd.node,
          className: 'game-detail_records_medal-skeleton',
          color: LIGHT,
        });

        new Skeleton({
          parentNode: leftTd.node,
          className: 'game-detail_records_player-skeleton',
          color: LIGHT,
        });

        const rightTd = new Component({
          parentNode: tr.node,
          tagName: 'td',
          className: 'game-detail_records_right',
        });

        new Skeleton({
          parentNode: rightTd.node,
          className: 'game-detail_records_score-skeleton',
          color: LIGHT,
        });

        new Skeleton({
          parentNode: rightTd.node,
          className: 'game-detail_records_time-skeleton',
          color: LIGHT,
        });
      });
      return;
    }

    records.forEach((record) => {
      const tr = new Component({
        parentNode: tbody.node,
        tagName: 'tr',
        className: 'game-detail_records_row',
      });

      const leftTd = new Component({
        parentNode: tr.node,
        tagName: 'td',
        className: 'game-detail_records_left',
      });

      new Component({
        parentNode: leftTd.node,
        tagName: 'span',
        className: 'game-detail_records_medal',
        content: this.getMedal(record.position),
      });

      new Component({
        parentNode: leftTd.node,
        tagName: 'span',
        className: 'game-detail_records_player',
        content: record.playerName,
      });

      const rightTd = new Component({
        parentNode: tr.node,
        tagName: 'td',
        className: 'game-detail_records_right',
      });

      new Component({
        parentNode: rightTd.node,
        tagName: 'span',
        className: 'game-detail_records_score',
        content: `${record.score.toLocaleString()} pts`,
      });

      new Component({
        parentNode: rightTd.node,
        tagName: 'span',
        className: 'game-detail_records_time',
        content: this.formatTimeAgo(record.achievedAt),
      });
    });
  }

  private getMedal(position: number): string {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return '🏅';
  }

  private formatTimeAgo(dateISO: string): string {
    const date = new Date(dateISO);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 1) return 'today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} week ago`;
  }
}
