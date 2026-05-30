import type { Config } from '@netlify/functions';

// Basic, permissive email shape check. Real validation is Resend's job; this
// just rejects obvious garbage at the boundary before we spend an API call.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 254;

const RESEND_ENDPOINT = (audienceId: string) =>
  `https://api.resend.com/audiences/${audienceId}/contacts`;

function json(payload: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed.' }, 405);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const email = data.email;
  const honeypot = data['bot-field'];

  // Honeypot tripped: a bot filled the hidden field. Pretend success so we
  // don't signal the trap, but never touch Resend.
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    return json({ ok: true }, 200);
  }

  if (typeof email !== 'string' || email.length > MAX_EMAIL_LEN || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    // Operational error, not user fault. Log it (no PII) for the function logs.
    console.error('subscribe: missing RESEND_API_KEY or RESEND_AUDIENCE_ID');
    return json({ ok: false, error: 'Something went wrong on our end. Try again later.' }, 500);
  }

  let resendRes: Response;
  try {
    resendRes = await fetch(RESEND_ENDPOINT(audienceId), {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    });
  } catch {
    return json({ ok: false, error: 'Could not reach the mailing service. Try again.' }, 502);
  }

  if (!resendRes.ok) {
    // Log the status only — never the email (PII).
    console.error(`subscribe: Resend responded ${resendRes.status}`);
    return json({ ok: false, error: 'Could not add you right now. Try again.' }, 502);
  }

  return json({ ok: true }, 200);
};

export const config: Config = { path: '/api/subscribe' };
