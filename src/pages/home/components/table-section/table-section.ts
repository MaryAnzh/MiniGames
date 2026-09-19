import { Component } from '@components';
import type { ComponentProps } from '@types';

type TableSectionProps = Pick<ComponentProps, 'parentNode'>;
type RowType = {
  rank: string;
  player?: string;
  score: string;
  streak: string;
  isHeader?: boolean;
  avatar?: string;
  avatarColor?: string;
  name?: string;
};

export class TableSection extends Component {
  tableRows: RowType[] = [
    {
      rank: 'Rank',
      player: 'Player',
      score: 'Score',
      streak: 'Streak',
      isHeader: true,
    },
    {
      rank: '#1',
      avatar: 'AP',
      avatarColor: 'var(--primary)',
      name: 'Alex_Pro99',
      score: '94.2K',
      streak: '🔥 12d',
    },
    {
      rank: '#2',
      avatar: 'CG',
      avatarColor: 'var(--avatar-random-2)',
      name: 'CozyGamer',
      score: '81.4K',
      streak: '🔥 8d',
    },
    {
      rank: '#3',
      avatar: 'MM',
      avatarColor: 'var(--avatar-random-3)',
      name: 'MatchMaster',
      score: '72.1K',
      streak: '🔥 5d',
    },
  ];

  constructor({ parentNode }: TableSectionProps) {
    super({
      parentNode,
      tagName: 'section',
      className: 'table-section',
    });

    this.renderTitle();
    this.renderTable();
  }

  private renderTitle() {
    const titleWrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'table-section_title-wrap',
    });

    new Component({
      parentNode: titleWrap.node,
      tagName: 'span',
      className: 'table-section_title-wrap_tag',
    });

    new Component({
      parentNode: titleWrap.node,
      tagName: 'h2',
      className: 'table-section_title-wrap_title',
      content: 'Top Players',
    });
  }

  private renderTable() {
    const table = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'table-section_table',
    });

    this.tableRows.forEach((row) => this.renderRow(table.node, row));
  }

  private renderRow(parent: HTMLElement, row: RowType) {
    const rowEl = new Component({
      parentNode: parent,
      tagName: 'div',
      className: `table-section_row ${row.isHeader ? 'table-section_row--header' : ''}`,
    });

    // Rank
    new Component({
      parentNode: rowEl.node,
      tagName: 'span',
      className: `${row.isHeader ? 'header-col' : 'col-rank'}`,
      content: row.rank,
    });

    // Player
    if (row.isHeader) {
      new Component({
        parentNode: rowEl.node,
        tagName: 'span',
        className: `header-col`,
        content: row.player,
      });
    } else {
      const playerCell = new Component({
        parentNode: rowEl.node,
        tagName: 'div',
        className: 'col-player player-cell',
      });

      // avatar
      new Component({
        parentNode: playerCell.node,
        tagName: 'div',
        className: 'player-avatar',
        content: row.avatar!,
        attrs: [{ attr: 'style', value: `background:${row.avatarColor}` }],
      });

      //player name
      new Component({
        parentNode: playerCell.node,
        tagName: 'span',
        className: 'player-name',
        content: row.name!,
      });
    }

    // Score
    new Component({
      parentNode: rowEl.node,
      tagName: 'span',
      className: `${row.isHeader ? 'header-col' : 'col-score'}`,
      content: row.score,
    });

    // Streak
    new Component({
      parentNode: rowEl.node,
      tagName: 'span',
      className: `${row.isHeader ? 'header-col' : 'col-streak'}`,
      content: row.streak,
    });
  }
}
