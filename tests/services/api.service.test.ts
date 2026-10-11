import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as C from '@constants';
import * as R from '@services';
import type { SnackbarPortal } from '@components';

describe('ApiService', () => {
  let snackbar: SnackbarPortal;
  let api: R.ApiService;

  beforeEach(() => {
    snackbar = { show: vi.fn() } as unknown as SnackbarPortal;
    api = new R.ApiService({ snackbar });
    vi.resetAllMocks();
  });

  it('get() returns SUCCESS with parsed JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ a: 1 }),
      }),
    );

    const res = await api.get('/test');

    expect(res.status).toBe(C.SUCCESS);
    if (res.status === C.SUCCESS) {
      expect(res.data).toEqual({ a: 1 });
    }
  });

  it('get() handles 404 error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    const res = await api.get('/missing', 'Missing');

    expect(res.status).toBe(C.ERROR);
    if (res.status === C.ERROR) {
      expect(res.error).toBe('Resource MISSING not found.');
    }
    expect(snackbar.show).toHaveBeenCalled();
  });

  it('get() handles 500 error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const res = await api.get('/server', 'Server');

    expect(res.status).toBe(C.ERROR);
    if (res.status === C.ERROR) {
      expect(res.error).toBe('Server error for SERVER. Try again later.');
    }
    expect(snackbar.show).toHaveBeenCalled();
  });

  it('get() handles network error', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network fail'));

    const res = await api.get('/fail');

    expect(res.status).toBe(C.ERROR);
    if (res.status === C.ERROR) {
      expect(res.error).toBe(C.ERROR_GROUP.NETWORK);
    }
    expect(snackbar.show).toHaveBeenCalled();
  });

  it('post() returns SUCCESS with parsed JSON', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { x: 1 } }),
    });

    const res = await api.post('/post', { a: 1 });

    expect(res.status).toBe(C.SUCCESS);
    if (res.status === C.SUCCESS) {
      expect(res.data).toEqual({ x: 1 });
    }
  });

  it('post() handles error response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
    });

    const res = await api.post('/post', { a: 1 }, 'Post');

    expect(res.status).toBe(C.ERROR);
    expect(snackbar.show).toHaveBeenCalled();
  });

  it('post() handles network error', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network fail'));

    const res = await api.post('/post', { a: 1 });

    expect(res.status).toBe(C.ERROR);
    if (res.status === C.ERROR) {
      expect(res.error).toBe(C.ERROR_GROUP.NETWORK);
    }
    expect(snackbar.show).toHaveBeenCalled();
  });

  it('getGames builds correct query params', async () => {
    const spy = vi.spyOn(api, 'get').mockResolvedValue({ status: C.SUCCESS, data: [] });

    await api.getGames({
      page: 2,
      limit: 10,
      category: 'action',
      sort: 'rating_desc',
    });

    expect(spy).toHaveBeenCalledWith(
      `${R.GAMES}?page=2&limit=10&category=action&sort=rating_desc`,
      R.GAMES,
    );
  });

  it('getGameDetails passes userEmail in query', async () => {
    const spy = vi.spyOn(api, 'get').mockResolvedValue({ status: C.SUCCESS, data: {} });

    await api.getGameDetails('slug-123', 'user@mail.com');

    expect(spy).toHaveBeenCalledWith(
      `${R.GAMES}/slug-123?userEmail=user%40mail.com`,
      'Game slug-123',
    );
  });

  it('getGameComments builds correct query params', async () => {
    const spy = vi.spyOn(api, 'get').mockResolvedValue({ status: C.SUCCESS, data: [] });

    await api.getGameComments('slug-123', {
      limit: 5,
      sort: 'newest',
      userEmail: 'u@mail.com',
    });

    expect(spy).toHaveBeenCalledWith(
      `${R.GAMES}/slug-123/${R.COMMENTS}?limit=5&sort=newest&userEmail=u%40mail.com`,
      'Game slug-123 comments',
    );
  });

  it('postComment calls POST with correct body', async () => {
    const spy = vi.spyOn(api, 'post').mockResolvedValue({ status: C.SUCCESS, data: {} });

    await api.postComment('slug-123', {
      userEmail: 'u@mail.com',
      authorName: 'User',
      text: 'Hello',
    });

    expect(spy).toHaveBeenCalledWith(
      `${R.GAMES}/slug-123/${R.COMMENTS}`,
      {
        userEmail: 'u@mail.com',
        authorName: 'User',
        text: 'Hello',
      },
      'Comment slug-123 Create',
    );
  });

  it('toggleFavorite calls POST with correct body', async () => {
    const spy = vi.spyOn(api, 'post').mockResolvedValue({ status: C.SUCCESS, data: {} });

    await api.toggleFavorite('slug-123', { userEmail: 'u@mail.com' });

    expect(spy).toHaveBeenCalledWith(
      `${R.GAMES}/slug-123/favorite`,
      { userEmail: 'u@mail.com' },
      'Game slug-123 Favorite',
    );
  });

  it('toggleCommentLike calls POST with correct body', async () => {
    const spy = vi.spyOn(api, 'post').mockResolvedValue({ status: C.SUCCESS, data: {} });

    await api.toggleCommentLike('comment-1', { userEmail: 'u@mail.com' });

    expect(spy).toHaveBeenCalledWith(`${R.COMMENTS}/comment-1/like`, { userEmail: 'u@mail.com' });
  });
});
