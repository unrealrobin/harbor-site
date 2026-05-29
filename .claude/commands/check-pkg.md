---
description: Confirm the latest stable version of an npm package before installing. Required before any npm install <pkg>.
argument-hint: <package-name>
---

# /check-pkg

Confirm the latest stable version of `$1` from the npm registry. Never install based on memory of "the latest version" — registry is authoritative.

## Steps

1. Run `npm view $1 version` — this returns the version published under the `latest` dist-tag.
2. Run `npm view $1 dist-tags` — show all dist-tags (latest, next, beta, etc.) so the user sees whether a newer pre-release exists.
3. Run `npm view $1 time --json | tail -20` — show the most recent publish dates. **If the latest stable was published < 6 months ago, surface that as a risk note.**
4. Run `npm view $1 deprecated` — if the package is deprecated, **stop** and report.
5. Run `npm view $1 repository.url homepage` — give the user a quick link to verify the package isn't a typosquat.
6. If the package is already in `package.json`, run `npm ls $1` to show the currently installed version and whether it's behind.

## Output format

```
Package: <name>
Latest stable: <version> (published <date>)
Other tags: next=..., beta=...
Currently installed: <version> | not installed
Repo: <url>
Risk notes: <e.g. "Published 2 weeks ago — early adoption", or "deprecated", or none>

Recommend: npm install <name>@<latest-stable>
```

Do not run `npm install` yourself. The user installs after reviewing.
