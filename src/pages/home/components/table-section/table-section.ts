import { Component } from '@components';
import { DARK, LIGHT, SUCCESS } from '@constants';
import type { ComponentProps, LeaderBoardType, ResponseStatusType } from '@types';
import { Skeleton, SkeletonText } from '@ui';
import { arrayFromNumber, getAvatarLetters } from '@utils';

type TableSectionProps = Pick<ComponentProps, 'parentNode'> & {
  status: ResponseStatusType;
  leaderBoard: LeaderBoardType[];
};

type RowType = {
  rank: string;
  player?: string;
  games?: string;
  score: string;
  streak: string;
  favorite?: string;
  isHeader?: boolean;
};

const EMPTY_ROW: LeaderBoardType = {
  favoriteGameName: ' ',
  favoriteGameSlug: ' ',
  gamesPlayed: 0,
  playerName: ' ',
  rank: 0,
  streakDays: 0,
  totalScore: 0,
};

const ROWS_COUNT = 5;

export class TableSection extends Component {
  status: ResponseStatusType;
  leaderboard: LeaderBoardType[];
  tableHeader: RowType = {
    isHeader: true,
    rank: 'Rank',
    player: 'Player',
    games: 'Games Played',
    score: 'Total Score',
    streak: 'Streak',
    favorite: 'Favorite Game',
  };
  rows: Component | null = null;

  constructor({ parentNode, status, leaderBoard }: TableSectionProps) {
    super({
      parentNode,
      tagName: 'section',
      className: 'table-section',
    });

    this.status = status;
    this.leaderboard = leaderBoard;

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
      content: '',
    });
  }

  private renderTable() {
    const table = new Component({
      parentNode: this.node,
      tagName: 'table',
      className: 'table-section_table',
    });

    this.renderHeader(table.node, this.tableHeader);

    this.rows = new Component({
      parentNode: table.node,
      tagName: 'tbody',
      className: 'table-section_table_body',
    });

    const body = this.rows;

    if (body) {
      if (!this.leaderboard || this.leaderboard.length === 0) {
        arrayFromNumber(ROWS_COUNT).forEach(() => this.renderRow(body.node, EMPTY_ROW));
      } else {
        this.leaderboard.forEach((row) => this.renderRow(body.node, row));
      }
    }
  }

  private renderHeader(parent: HTMLElement, row: RowType) {
    const rowEl = new Component({
      parentNode: parent,
      tagName: 'thead',
    });

    const tr = new Component({
      parentNode: rowEl.node,
      tagName: 'tr',
      className: ['table-section_row', 'table-section_row--header'],
    });

    const headerClass = 'header-col';

    new Component({
      parentNode: tr.node,
      tagName: 'th',
      content: row.rank,
      className: headerClass,
    });

    new Component({
      parentNode: tr.node,
      tagName: 'th',
      content: row.player,
      className: headerClass,
    });

    new Component({
      parentNode: tr.node,
      tagName: 'th',
      className: ['header_games', headerClass],
    });

    new Component({
      parentNode: tr.node,
      tagName: 'th',
      className: ['header-score', headerClass],
    });

    new Component({
      parentNode: tr.node,
      tagName: 'th',
      content: row.streak,
      className: headerClass,
    });

    new Component({
      parentNode: tr.node,
      tagName: 'th',
      content: row.favorite,
      className: ['header_favorite', headerClass],
    });
  }

  private renderRow(parentNode: HTMLElement, row: LeaderBoardType) {
    const tr = new Component({
      parentNode,
      tagName: 'tr',
      className: 'table-section_row',
    });
    const ceilClass = 'home_table-ceil';
    // Rank
    const rank = new Component({
      parentNode: tr.node,
      tagName: 'td',
      content: row.rank ? `#${row.rank}` : '',
      className: ['col-rank', ceilClass],
    });

    // Player cell
    const playerCell = new Component({
      parentNode: tr.node,
      tagName: 'td',
      className: ['col-player'],
    });

    const avatar = new Component({
      parentNode: playerCell.node,
      tagName: 'div',
      className: 'player-avatar',
      content: row.playerName ? getAvatarLetters(row.playerName) : '',
    });

    const playerName = new Component({
      parentNode: playerCell.node,
      tagName: 'span',
      className: 'player-name',
      content: row.playerName || ' ',
    });

    // Games
    const games = new Component({
      parentNode: tr.node,
      tagName: 'td',
      content: row.gamesPlayed ? row.gamesPlayed.toString() : '',
      className: ['col-games', ceilClass],
    });

    // Score
    const score = new Component({
      parentNode: tr.node,
      tagName: 'td',
      content: row.totalScore ? row.totalScore.toString() : '',
      className: ['col-score', ceilClass],
    });

    // Streak
    const streakDays = new Component({
      parentNode: tr.node,
      tagName: 'td',
      content: row.streakDays ? `🔥 ${row.streakDays}` : ' ',
      className: ['col-streak', ceilClass],
    });

    // Favorite
    const favorite = new Component({
      parentNode: tr.node,
      tagName: 'td',
      content: row.favoriteGameSlug || ' ',
      className: ['col-favorite', ceilClass],
    });

    if (this.leaderboard.length === 0) {
      [favorite, avatar].forEach((el) => new Skeleton({ parentNode: el.node, color: LIGHT }));
      [rank, score, streakDays, games, playerName].forEach(
        (el) => new SkeletonText({ parentNode: el.node, color: LIGHT }),
      );
    }
  }

  public updateRows(data: LeaderBoardType[]) {
    this.leaderboard = data;
    this.status = SUCCESS;

    if (this.rows) {
      this.rows.node.innerHTML = '';
      data.forEach((row) => this.renderRow(this.rows!.node, row));
    }
  }
}
