import { describe, expect, it } from 'vitest';
import { shouldLoadAnalytics } from '../src/lib/analytics';

describe('shouldLoadAnalytics', () => {
  it('loads on the production context', () => {
    expect(shouldLoadAnalytics('production')).toBe(true);
  });

  it('does NOT load on deploy-preview (branch deploy)', () => {
    expect(shouldLoadAnalytics('deploy-preview')).toBe(false);
  });

  it('does NOT load on branch-deploy', () => {
    expect(shouldLoadAnalytics('branch-deploy')).toBe(false);
  });

  it('does NOT load in local dev (context undefined)', () => {
    expect(shouldLoadAnalytics(undefined)).toBe(false);
  });
});
