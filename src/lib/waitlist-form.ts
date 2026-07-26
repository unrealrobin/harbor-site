// Client-side waitlist form wiring, shared by the homepage and /early-access.
// Posts to the /api/subscribe Netlify Function; on success, swaps the form for
// its success state; on failure, shows a readable error. PostHog
// (production-only) is optional-chained.
export function wireForm(formId: string, successId: string, errorId: string, location: string) {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const success = document.getElementById(successId);
  const errorEl = document.getElementById(errorId);
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const idleLabel = button.textContent ?? 'Get access';
    const fields = new FormData(form);
    const payload = {
      email: String(fields.get('email') ?? ''),
      'bot-field': String(fields.get('bot-field') ?? ''),
    };

    button.disabled = true;
    button.textContent = 'Sending…';
    errorEl?.setAttribute('hidden', '');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = (await res.json().catch(() => ({ ok: false, error: '' }))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !result.ok) {
        throw new Error(result.error || 'Something went wrong. Try again?');
      }
      // Event name frozen for analytics continuity (button copy has changed
      // since launch); renaming it would fork the PostHog funnel history.
      window.posthog?.capture('notify_me_submit', { location });
      form.setAttribute('hidden', '');
      success?.removeAttribute('hidden');
      (success as HTMLElement | null)?.focus();
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = err instanceof Error ? err.message : 'Something went wrong. Try again?';
        errorEl.removeAttribute('hidden');
      }
      button.disabled = false;
      button.textContent = idleLabel;
    }
  });
}
