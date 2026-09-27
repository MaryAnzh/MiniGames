import { Component } from '@components';
import type { ComponentProps, GameRecord } from '@types';

type RecordsSectionProps = Pick<ComponentProps, 'parentNode'> & {
  records: GameRecord[];
};

export class RecordsSection extends Component {
  constructor({ parentNode, records }: RecordsSectionProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'game-detail_records',
    });

    this.render(records);
  }

  private render(records: GameRecord[]) {
    const titleRow = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'game-detail_records_title-row',
    });

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

    const table = new Component({
      parentNode: this.node,
      tagName: 'table',
      className: 'game-detail_records_table',
    });

    const tbody = new Component({
      parentNode: table.node,
      tagName: 'tbody',
    });

    const randomRecords = [...records].sort(() => Math.random() - 0.5).slice(0, 4);

    randomRecords.forEach((record) => {
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
