import type { HomePage } from './home/home';
import type { LibraryPage } from './library/library';
import type { CommunityPage } from './community/community';
import type { TournamentsPage } from './tournaments/tournaments';
import type { NotFoundPage } from './not-found/not-found';

export type PageComponentType =
  HomePage | LibraryPage | TournamentsPage | NotFoundPage | CommunityPage;
