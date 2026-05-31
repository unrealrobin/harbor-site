/**
 * Analytics (PostHog) gating.
 *
 * The snippet must load ONLY on the Netlify *production* deploy — never in
 * local dev (where CONTEXT is undefined) and never on deploy-preview /
 * branch-deploy builds (which are still `astro build`, so `import.meta.env.PROD`
 * would be true — that's why we gate on Netlify's CONTEXT, not PROD).
 *
 * Netlify sets `CONTEXT` at build time: "production" | "deploy-preview" |
 * "branch-deploy" | "dev". https://docs.netlify.com/configure-builds/environment-variables/#build-metadata
 */
export function shouldLoadAnalytics(context: string | undefined): boolean {
  return context === 'production';
}
