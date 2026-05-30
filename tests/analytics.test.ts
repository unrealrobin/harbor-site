import { describe, expect, it } from 'vitest';
import { DEFAULT_POSTHOG_HOST, shouldLoadAnalytics } from '../src/lib/analytics';

const KEY = 'phc_test_key';

describe('shouldLoadAnalytics', () => {
  it('loads on the production context with a key', () => {
    expect(shouldLoadAnalytics('production', KEY)).toBe(true);
  });

  it('does NOT load on deploy-preview (branch deploy) even with a key', () => {
    expect(shouldLoadAnalytics('deploy-preview', KEY)).toBe(false);
  });

  it('does NOT load on branch-deploy even with a key', () => {
    expect(shouldLoadAnalytics('branch-deploy', KEY)).toBe(false);
  });

  it('does NOT load in local dev (context undefined)', () => {
    expect(shouldLoadAnalytics(undefined, KEY)).toBe(false);
  });

  it('does NOT load in production without a key', () => {
    expect(shouldLoadAnalytics('production', undefined)).toBe(false);
  });

  it('treats an empty-string key as no key', () => {
    expect(shouldLoadAnalytics('production', '')).toBe(false);
  });
});

describe('DEFAULT_POSTHOG_HOST', () => {
  it('points at the US ingest host', () => {
    expect(DEFAULT_POSTHOG_HOST).toBe('https://us.i.posthog.com');
  });
});
