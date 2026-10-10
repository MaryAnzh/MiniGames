import { describe, it, expect, beforeEach, vi } from 'vitest';
import { appStore } from '@store';
import { appEvents } from '@utils';

vi.mock('@services', () => {
  return {
    ApiService: class {
      getGames = vi.fn();
      getLeaders = vi.fn();
      getCategories = vi.fn();
      getGameDetails = vi.fn();
      getGameComments = vi.fn();
      postComment = vi.fn();
      toggleFavorite = vi.fn();
      toggleCommentLike = vi.fn();
    },
    AuthService: class {
      login = vi.fn();
      loginWithGoogle = vi.fn();
      register = vi.fn();
      logout = vi.fn();
    },
  };
});

describe('AppStore: API Layer', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    appStore['clearSession']();

    vi.spyOn(appEvents, 'emit').mockImplementation(() => {});
  });

  it('getGames calls api.getGames with params', async () => {
    const spy = vi.spyOn(appStore['api'], 'getGames');

    await appStore.getGames({ limit: 10 });

    expect(spy).toHaveBeenCalledWith({ limit: 10 });
  });

  it('getLeaderboard calls api.getLeaders', async () => {
    const spy = vi.spyOn(appStore['api'], 'getLeaders');

    await appStore.getLeaderboard();

    expect(spy).toHaveBeenCalled();
  });

  it('getCategories calls api.getCategories', async () => {
    const spy = vi.spyOn(appStore['api'], 'getCategories');

    await appStore.getCategories();

    expect(spy).toHaveBeenCalled();
  });

  it('getGameDetails passes userEmail when authenticated', async () => {
    const spy = vi.spyOn(appStore['api'], 'getGameDetails');

    vi.spyOn(appStore, 'checkSession').mockResolvedValue(true);

    appStore.setAuthData({
      isAuth: true,
      email: 'user@mail.com',
      displayName: 'User',
    });

    await appStore.getGameDetails('slug-123');

    expect(spy).toHaveBeenCalledWith('slug-123', 'user@mail.com');
  });

  it('getGameComments passes userEmail when authenticated', async () => {
    const spy = vi.spyOn(appStore['api'], 'getGameComments');

    appStore.setAuthData({
      isAuth: true,
      email: 'user@mail.com',
      displayName: 'User',
    });
    vi.spyOn(appStore, 'checkSession').mockResolvedValue(true);

    await appStore.getGameComments('slug-123', { limit: 5 });

    expect(spy).toHaveBeenCalledWith('slug-123', {
      limit: 5,
      userEmail: 'user@mail.com',
    });
  });

  it('postComment calls api.postComment when authenticated', async () => {
    const spy = vi.spyOn(appStore['api'], 'postComment');

    appStore.setAuthData({
      isAuth: true,
      email: 'user@mail.com',
      displayName: 'User',
    });
    vi.spyOn(appStore, 'checkSession').mockResolvedValue(true);

    await appStore.postComment('slug-123', 'hello');

    expect(spy).toHaveBeenCalledWith('slug-123', {
      userEmail: 'user@mail.com',
      authorName: 'User',
      text: 'hello',
    });
  });

  it('toggleFavorite calls api.toggleFavorite with userEmail', async () => {
    const spy = vi.spyOn(appStore['api'], 'toggleFavorite');

    appStore.setAuthData({
      isAuth: true,
      email: 'user@mail.com',
      displayName: 'User',
    });
    vi.spyOn(appStore, 'checkSession').mockResolvedValue(true);

    await appStore.toggleFavorite('slug-123');

    expect(spy).toHaveBeenCalledWith('slug-123', {
      userEmail: 'user@mail.com',
    });
  });

  it('toggleCommentLike calls api.toggleCommentLike with userEmail', async () => {
    const spy = vi.spyOn(appStore['api'], 'toggleCommentLike');

    appStore.setAuthData({
      isAuth: true,
      email: 'user@mail.com',
      displayName: 'User',
    });
    vi.spyOn(appStore, 'checkSession').mockResolvedValue(true);

    await appStore.toggleCommentLike('comment-1');

    expect(spy).toHaveBeenCalledWith('comment-1', {
      userEmail: 'user@mail.com',
    });
  });
});
