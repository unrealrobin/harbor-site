import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import subscribe from '../netlify/functions/subscribe';
import { server } from './mocks/server';
import { RESEND_CONTACTS } from './mocks/handlers';

const API_KEY = 're_test_abc123';
const AUDIENCE_ID = 'aud_0000-1111';

/** Build a Request the way Netlify hands it to the function. */
function makeRequest(
  init: { method?: string; body?: string; headers?: Record<string, string> } = {},
): Request {
  const { method = 'POST', body, headers } = init;
  return new Request('https://harborlauncher.com/api/subscribe', {
    method,
    headers: { 'content-type': 'application/json', ...headers },
    body,
  });
}

/** JSON-encode a body object for the POST. */
function jsonBody(payload: unknown): string {
  return JSON.stringify(payload);
}

describe('subscribe Netlify Function', () => {
  beforeEach(() => {
    vi.stubEnv('RESEND_API_KEY', API_KEY);
    vi.stubEnv('RESEND_AUDIENCE_ID', AUDIENCE_ID);
    // Silence the function's console.error (operational logging) so test output
    // stays clean; we never assert on it.
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  // 1. Method gate -----------------------------------------------------------
  it('returns 405 for a non-POST method and never calls Resend', async () => {
    // Arrange: any request hitting Resend in this test is a failure — register
    // a spy handler that flips a flag if it is ever called.
    let resendHit = false;
    server.use(
      http.post(RESEND_CONTACTS, () => {
        resendHit = true;
        return HttpResponse.json({ object: 'contact', id: 'x' }, { status: 201 });
      }),
    );

    // Act
    const res = await subscribe(makeRequest({ method: 'GET', body: undefined }));

    // Assert
    expect(res.status).toBe(405);
    expect(await res.json()).toEqual({ ok: false, error: 'Method not allowed.' });
    expect(resendHit).toBe(false);
  });

  // 2. Body parsing ----------------------------------------------------------
  it('returns 400 when the JSON body is unparseable', async () => {
    // Arrange: a POST with a syntactically broken body.
    const res = await subscribe(makeRequest({ body: '{ not valid json' }));

    // Assert
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: 'Invalid request.' });
  });

  it('returns 400 when the parsed JSON body is null', async () => {
    // `JSON.parse("null")` succeeds and yields null, so the parse try/catch does
    // not fire. The `body ?? {}` fallback then produces an empty object with no
    // email, which must be rejected at the email branch.
    const res = await subscribe(makeRequest({ body: 'null' }));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      ok: false,
      error: 'Please enter a valid email address.',
    });
  });

  // 3. Honeypot --------------------------------------------------------------
  it('returns 200 and skips Resend when the honeypot field is filled', async () => {
    // Arrange: bot-field set means a bot tripped the trap. We must NOT reach Resend.
    let resendHit = false;
    server.use(
      http.post(RESEND_CONTACTS, () => {
        resendHit = true;
        return HttpResponse.json({ object: 'contact', id: 'x' }, { status: 201 });
      }),
    );

    // Act: include a real-looking email to prove the honeypot short-circuits
    // *before* email validation/Resend.
    const res = await subscribe(
      makeRequest({
        body: jsonBody({ email: 'alex@indiestudio.com', 'bot-field': 'i-am-a-bot' }),
      }),
    );

    // Assert
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(resendHit).toBe(false);
  });

  it('does NOT treat a whitespace-only honeypot as tripped (falls through to email validation)', async () => {
    // Regression guard: honeypot uses .trim() !== '' — a whitespace value must
    // not short-circuit. With no valid email present, this must reach the email
    // branch and 400, not silently 200.
    const res = await subscribe(
      makeRequest({ body: jsonBody({ 'bot-field': '   ' }) }),
    );

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      ok: false,
      error: 'Please enter a valid email address.',
    });
  });

  // 4. Email validation ------------------------------------------------------
  it('returns 400 when email is missing', async () => {
    const res = await subscribe(makeRequest({ body: jsonBody({}) }));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      ok: false,
      error: 'Please enter a valid email address.',
    });
  });

  it('returns 400 when email is not a string', async () => {
    const res = await subscribe(makeRequest({ body: jsonBody({ email: 12345 }) }));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      ok: false,
      error: 'Please enter a valid email address.',
    });
  });

  it('returns 400 when email is malformed', async () => {
    const res = await subscribe(
      makeRequest({ body: jsonBody({ email: 'not-an-email' }) }),
    );

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      ok: false,
      error: 'Please enter a valid email address.',
    });
  });

  it('returns 400 when email exceeds 254 characters', async () => {
    // Arrange: a structurally valid address whose total length is 255 (> MAX).
    // local part padded so the whole string is one over the boundary.
    const longLocal = 'a'.repeat(255 - '@indiestudio.com'.length);
    const overLong = `${longLocal}@indiestudio.com`;
    expect(overLong.length).toBe(255); // boundary sanity, not the unit under test

    const res = await subscribe(makeRequest({ body: jsonBody({ email: overLong }) }));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      ok: false,
      error: 'Please enter a valid email address.',
    });
  });

  // 5. Missing env -----------------------------------------------------------
  it('returns 500 when RESEND_API_KEY is absent', async () => {
    // Arrange: drop the key; keep the audience id.
    vi.stubEnv('RESEND_API_KEY', '');

    const res = await subscribe(
      makeRequest({ body: jsonBody({ email: 'alex@indiestudio.com' }) }),
    );

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      ok: false,
      error: 'Something went wrong on our end. Try again later.',
    });
  });

  it('returns 500 when RESEND_AUDIENCE_ID is absent', async () => {
    // Arrange: drop the audience id; keep the key.
    vi.stubEnv('RESEND_AUDIENCE_ID', '');

    const res = await subscribe(
      makeRequest({ body: jsonBody({ email: 'alex@indiestudio.com' }) }),
    );

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      ok: false,
      error: 'Something went wrong on our end. Try again later.',
    });
  });

  // 6. Happy path ------------------------------------------------------------
  it('returns 200 and sends the correctly-shaped request to Resend on a valid submission', async () => {
    // Arrange: capture exactly what Resend receives.
    let capturedUrl = '';
    let capturedAuth: string | null = null;
    let capturedBody: unknown;
    server.use(
      http.post(RESEND_CONTACTS, async ({ request }) => {
        capturedUrl = request.url;
        capturedAuth = request.headers.get('authorization');
        capturedBody = await request.json();
        return HttpResponse.json(
          { object: 'contact', id: '11111111-1111-1111-1111-111111111111' },
          { status: 201 },
        );
      }),
    );

    // Act
    const res = await subscribe(
      makeRequest({ body: jsonBody({ email: 'alex@indiestudio.com' }) }),
    );

    // Assert: caller response
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    // Assert: the outbound contract to Resend — URL carries the audience id from
    // env, auth is the bearer key, body contains the email.
    expect(capturedUrl).toBe(
      `https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`,
    );
    expect(capturedAuth).toBe(`Bearer ${API_KEY}`);
    expect(capturedBody).toEqual({ email: 'alex@indiestudio.com', unsubscribed: false });
  });

  // 7. Resend non-ok responses ----------------------------------------------
  it('returns 502 when Resend responds 422 (validation rejection)', async () => {
    server.use(
      http.post(RESEND_CONTACTS, () =>
        HttpResponse.json(
          { statusCode: 422, message: 'Contact already exists' },
          { status: 422 },
        ),
      ),
    );

    const res = await subscribe(
      makeRequest({ body: jsonBody({ email: 'alex@indiestudio.com' }) }),
    );

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({
      ok: false,
      error: 'Could not add you right now. Try again.',
    });
  });

  it('returns 502 when Resend responds 500 (upstream error)', async () => {
    server.use(
      http.post(RESEND_CONTACTS, () =>
        HttpResponse.json({ message: 'Internal server error' }, { status: 500 }),
      ),
    );

    const res = await subscribe(
      makeRequest({ body: jsonBody({ email: 'alex@indiestudio.com' }) }),
    );

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({
      ok: false,
      error: 'Could not add you right now. Try again.',
    });
  });

  // 8. Network failure -------------------------------------------------------
  it('returns 502 when the fetch to Resend throws (network failure)', async () => {
    // Arrange: HttpResponse.error() makes fetch reject, exercising the catch.
    server.use(http.post(RESEND_CONTACTS, () => HttpResponse.error()));

    const res = await subscribe(
      makeRequest({ body: jsonBody({ email: 'alex@indiestudio.com' }) }),
    );

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({
      ok: false,
      error: 'Could not reach the mailing service. Try again.',
    });
  });
});
