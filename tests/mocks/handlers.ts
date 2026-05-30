import { http, HttpResponse } from 'msw';

// Resend "add contact to audience" endpoint.
// https://resend.com/docs/api-reference/contacts/create-contact
export const RESEND_CONTACTS = 'https://api.resend.com/audiences/:audienceId/contacts';

// Default: a successful contact creation. Individual tests override this with
// server.use(...) to exercise Resend 4xx/5xx and network-failure branches.
export const handlers = [
  http.post(RESEND_CONTACTS, () =>
    HttpResponse.json(
      { object: 'contact', id: '11111111-1111-1111-1111-111111111111' },
      { status: 201 },
    ),
  ),
];
