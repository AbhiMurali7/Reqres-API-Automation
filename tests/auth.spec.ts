import { test, expect } from './fixtures';
import { apiData } from '../utils/testData';

test.describe('AUTH API', () => {

  // ── LOGIN ─────────────────────────────────────────────────────

  test('POST /login — Valid credentials returns token', async ({ userApi }) => {
    const res  = await userApi.login(apiData.validUser.email, apiData.validUser.password);
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body.token).toBeDefined();
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('POST /login — Missing password returns 400', async ({ userApi }) => {
    const res  = await userApi.login(apiData.validUser.email, '');
    const body = await res.json();

    expect(res.status()).toBe(400);
    expect(body.error).toBeDefined();
  });

  test('POST /login — Invalid email returns 400', async ({ userApi }) => {
    const res  = await userApi.login(apiData.invalidUser.email, 'wrongpass');
    const body = await res.json();

    expect(res.status()).toBe(400);
    expect(body.error).toBeDefined();
  });

  // ── REGISTER ──────────────────────────────────────────────────

  test('POST /register — Valid registration returns token', async ({ userApi }) => {
    const res  = await userApi.register(apiData.registerUser.email, apiData.registerUser.password);
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body.id).toBeDefined();
    expect(body.token).toBeDefined();
    expect(typeof body.token).toBe('string');
  });

  test('POST /register — Missing password returns 400', async ({ userApi }) => {
    const res  = await userApi.register(apiData.registerUser.email, '');
    const body = await res.json();

    expect(res.status()).toBe(400);
    expect(body.error).toBeDefined();
  });

  test('POST /register — Undefined user returns 400', async ({ userApi }) => {
    const res  = await userApi.register(apiData.invalidUser.email, 'somepassword');
    const body = await res.json();

    expect(res.status()).toBe(400);
    expect(body.error).toBeDefined();
  });

});