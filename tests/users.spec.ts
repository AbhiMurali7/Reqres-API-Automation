import { test, expect } from './fixtures';
import { apiData } from '../utils/testData';

test.describe('USERS API', () => {

  // ── GET ───────────────────────────────────────────────────────

  test('GET /users — List users page 1', async ({ userApi }) => {
    const res  = await userApi.getUsers(1);
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body.page).toBe(1);
    expect(body.per_page).toBe(apiData.existingUsers.perPage);
    expect(body.total).toBe(apiData.existingUsers.totalUsers);
    expect(body.total_pages).toBe(apiData.existingUsers.totalPages);
    expect(body.data).toHaveLength(6);
    expect(body.data[0]).toMatchObject({
      id:         expect.any(Number),
      email:      expect.stringContaining('@reqres.in'),
      first_name: expect.any(String),
      last_name:  expect.any(String),
      avatar:     expect.stringContaining('https://'),
    });
  });

  test('GET /users — List users page 2', async ({ userApi }) => {
    const res  = await userApi.getUsers(2);
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body.page).toBe(2);
    expect(body.data).toHaveLength(6);
  });

  test('GET /users/2 — Single user', async ({ userApi }) => {
    const res  = await userApi.getUser(2);
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body.data).toMatchObject({
      id:         2,
      email:      'janet.weaver@reqres.in',
      first_name: 'Janet',
      last_name:  'Weaver',
      avatar:     expect.stringContaining('https://'),
    });
  });

  test('GET /users/999 — User not found returns 404', async ({ userApi }) => {
    const res = await userApi.getUser(999);
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body).toEqual({});
  });

  // ── POST ──────────────────────────────────────────────────────

  test('POST /users — Create user', async ({ userApi }) => {
    const res  = await userApi.createUser(apiData.newUser.name, apiData.newUser.job);
    const body = await res.json();

    expect(res.status()).toBe(201);
    expect(body).toMatchObject({
      name:      apiData.newUser.name,
      job:       apiData.newUser.job,
      id:        expect.any(String),
      createdAt: expect.any(String),
    });
    // createdAt is a valid ISO date
    expect(new Date(body.createdAt).toISOString()).toBe(body.createdAt);
  });

  test('POST /users — Created user has correct name and job', async ({ userApi }) => {
    const res  = await userApi.createUser('TestUser', 'Tester');
    const body = await res.json();

    expect(res.status()).toBe(201);
    expect(body.name).toBe('TestUser');
    expect(body.job).toBe('Tester');
  });

  // ── PUT ───────────────────────────────────────────────────────

  test('PUT /users/2 — Full update', async ({ userApi }) => {
    const res  = await userApi.updateUser(2, apiData.updatedUser.name, apiData.updatedUser.job);
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body).toMatchObject({
      name:      apiData.updatedUser.name,
      job:       apiData.updatedUser.job,
      updatedAt: expect.any(String),
    });
    expect(new Date(body.updatedAt).toISOString()).toBe(body.updatedAt);
  });

  // ── PATCH ─────────────────────────────────────────────────────

  test('PATCH /users/2 — Partial update', async ({ userApi }) => {
    const res  = await userApi.patchUser(2, apiData.patchedUser);
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body.job).toBe(apiData.patchedUser.job);
    expect(body.updatedAt).toBeDefined();
  });

  // ── DELETE ────────────────────────────────────────────────────

  test('DELETE /users/2 — Delete user returns 204', async ({ userApi }) => {
    const res = await userApi.deleteUser(2);
    expect(res.status()).toBe(204);
    // 204 No Content — body should be empty
    const body = await res.text();
    expect(body).toBe('');
  });

});