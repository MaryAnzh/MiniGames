import { Component } from '@components';
import { DARK, EMPTY, ERROR, LIGHT, SUCCESS } from '@constants';
import type { ComponentProps, LeaderBoardType, ResponseStatusType } from '@types';
import { Button, ErrorBanner, Skeleton, SkeletonText } from '@ui';
import { arrayFromNumber, getAvatarLetters } from '@utils';

type TableSectionProps = Pick<ComponentProps, 'parentNode'> & {
  status: ResponseStatusType;
  leaderBoard: LeaderBoardType[];
  onRetry: () => Promise<void>;
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

const EMPTY_DATA_ROW: LeaderBoardType = {
  favoriteGameName: '*---*',
  favoriteGameSlug: '*---*',
  gamesPlayed: 0,
  playerName: '*---*',
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
  errorBoner: Component;
  retryBtn: Button;

  onRetry: () => Promise<void>;

  constructor({ parentNode, status, leaderBoard, onRetry }: TableSectionProps) {
    super({
      parentNode,
      tagName: 'section',
      className: 'table-section',
    });

    this.status = status;
    this.leaderboard = leaderBoard;
    this.onRetry = onRetry;

    this.retryBtn = new Button({
      parentNode: null,
      ariaLabel: 'Retry',
      color: DARK,
      leftIcon: 'empty_table',
      size: 'md',
      className: 'table-section_title-wrap_retry-brn',
      text: 'Retry',
    });
    this.retryBtn.node.onclick = () => this.handleRetry();

    this.errorBoner = new ErrorBanner({
      parentNode: null,
      message: 'Server response error, check your connection or proxy',
      className: 'table-section-error',
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
      content: '',
    });
    wrap.append(this.retryBtn.node);
    this.retryBtn.node.style.display = 'none';
  }

  private renderTable() {
    const table = new Component({
      parentNode: this.node,
      tagName: 'table',
      className: 'table-section_table',
    });
    table.append(this.errorBoner.node);

    if (this.status !== ERROR) {
      this.errorBoner.node.style.display = 'none';
    }

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
    const tr = new Component({ parentNode, tagName: 'tr', className: 'table-section_row' });
    const ceilClass = 'home_table-ceil';

    const rank = new Component({
      parentNode: tr.node,
      tagName: 'td',
      content: row.rank ? `#${row.rank}` : '',
      className: ['col-rank', ceilClass],
    });
    const playerCell = new Component({
      parentNode: tr.node,
      tagName: 'td',
      className: ['col-player'],
    });
    const avatar = new Component({
      parentNode: playerCell.node,
      tagName: 'div',
      className: 'player-avatar',
      content: row.playerName ? getAvatarLetters(row.playerName) : '*',
    });
    const playerName = new Component({
      parentNode: playerCell.node,
      tagName: 'span',
      className: 'player-name',
      content: row.playerName,
    });
    const games = new Component({
      parentNode: tr.node,
      tagName: 'td',
      content: row.gamesPlayed.toString(),
      className: ['col-games', ceilClass],
    });
    const score = new Component({
      parentNode: tr.node,
      tagName: 'td',
      content: row.totalScore.toString(),
      className: ['col-score', ceilClass],
    });
    const streakDays = new Component({
      parentNode: tr.node,
      tagName: 'td',
      content: row.streakDays ? `🔥 ${row.streakDays}` : '*',
      className: ['col-streak', ceilClass],
    });
    const favorite = new Component({
      parentNode: tr.node,
      tagName: 'td',
      content: row.favoriteGameSlug,
      className: ['col-favorite', ceilClass],
    });

    if (row === EMPTY_ROW) {
      [favorite, avatar].forEach((el) => new Skeleton({ parentNode: el.node, color: LIGHT }));
      [rank, score, streakDays, games, playerName].forEach(
        (el) => new SkeletonText({ parentNode: el.node, color: LIGHT }),
      );
    }
  }

  private handleRetry = async () => {
    try {
      await this.onRetry();
    } catch {
      this.updateRows([], ERROR);
    }
  };

  public updateRows(data: LeaderBoardType[], status: ResponseStatusType) {
    this.leaderboard = data;
    this.status = status;
    if (this.rows) {
      this.rows.node.innerHTML = '';

      if (status === SUCCESS) {
        data.forEach((row) => this.renderRow(this.rows!.node, row));
        this.errorBoner.node.style.display = 'none';
        this.retryBtn.node.style.display = 'none';
      }
      if (status === EMPTY || status === ERROR) {
        arrayFromNumber(5).forEach(() => this.renderRow(this.rows!.node, EMPTY_DATA_ROW));
        this.retryBtn.node.style.display = 'flex';
      }
      if (status === ERROR) {
        this.errorBoner.node.style.display = 'flex';
      }
    }
  }
}
