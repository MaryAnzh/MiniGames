import { Component } from '@components';
import type { ComponentProps } from '@types';

type TableSectionProps = Pick<ComponentProps, 'parentNode'>;

type AddCellType = {
  parentNode: HTMLElement;
  content?: string;
  isHeader?: boolean;
  className: string;
  additionalClass?: string;
};

type RowType = {
  rank: string;
  player?: string;
  games?: string;
  score: string;
  streak: string;
  favorite?: string;
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
      games: 'Games Played',
      score: 'Total Score',
      streak: 'Streak',
      favorite: 'Favorite Game',
      isHeader: true,
    },
    {
      rank: '#1',
      avatar: 'AP',
      avatarColor: 'var(--primary)',
      name: 'Alex_Pro99',
      games: '142',
      score: '94,250',
      streak: '🔥 12d',
      favorite: 'Heartopia',
    },
    {
      rank: '#2',
      avatar: 'CG',
      avatarColor: 'var(--avatar-random-2)',
      name: 'CozyGamer_x',
      games: '118',
      score: '81,400',
      streak: '🔥 8d',
      favorite: 'Cat Mail Co.',
    },
    {
      rank: '#3',
      avatar: 'MM',
      avatarColor: 'var(--avatar-random-3)',
      name: 'MatchMaster',
      games: '98',
      score: '72,110',
      streak: '🔥 5d',
      favorite: 'Tiny Glade',
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
    const wrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'table-section_title-wrap',
    });

    new Component({
      parentNode: wrap.node,
      tagName: 'span',
      className: 'table-section_title-wrap_tag',
    });

    new Component({
      parentNode: wrap.node,
      tagName: 'h2',
      className: 'table-section_title-wrap_title',
      content: 'Top Players This Week',
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
    this.addCell({
      parentNode: rowEl.node,
      content: row.rank,
      isHeader: row.isHeader,
      className: 'col-rank',
    });

    // Player
    if (row.isHeader) {
      this.addCell({
        parentNode: rowEl.node,
        content: row.player,
        isHeader: true,
        className: 'header-col',
      });
    } else {
      const playerCell = new Component({
        parentNode: rowEl.node,
        tagName: 'div',
        className: 'col-player',
      });

      new Component({
        parentNode: playerCell.node,
        tagName: 'div',
        className: 'player-avatar',
        content: row.avatar!,
        attrs: [{ attr: 'style', value: `background:${row.avatarColor}` }],
      });

      new Component({
        parentNode: playerCell.node,
        tagName: 'span',
        className: 'player-name',
        content: row.name!,
      });
    }

    // Games
    this.addCell({
      parentNode: rowEl.node,
      content: row.isHeader ? '' : row.games,
      isHeader: row.isHeader,
      className: 'col-games',
      additionalClass: row.isHeader ? 'header_games' : '',
    });

    // Score
    this.addCell({
      parentNode: rowEl.node,
      content: row.isHeader ? '' : row.score,
      isHeader: row.isHeader,
      className: 'col-score',
      additionalClass: row.isHeader ? 'header-score' : '',
    });

    // Streak
    this.addCell({
      parentNode: rowEl.node,
      content: row.streak,
      isHeader: row.isHeader,
      className: 'col-streak',
    });

    // Favorite
    this.addCell({
      parentNode: rowEl.node,
      content: row.isHeader ? '' : row.favorite,
      isHeader: row.isHeader,
      className: 'col-favorite',
      additionalClass: row.isHeader ? 'header_favorite' : '',
    });
  }

  private addCell({ parentNode, content, isHeader, className, additionalClass }: AddCellType) {
    new Component({
      parentNode,
      tagName: 'span',
      className: `${isHeader ? 'header-col' : className} ${additionalClass ?? ''}`,
      content: content ?? '',
    });
  }
}
