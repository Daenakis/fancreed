---
name: review
description: Review a branch, PR or set of changes against fancreed project conventions and for bugs. Use when the user asks to review a dev's work, a PR, or "check this before merge".
---

# Review

Input: a branch name, PR number, or nothing (= current uncommitted changes + commits not on `main`).

Get the diff: `git diff main...<branch>` (or `gh pr diff <n>`). Read changed files in full where context matters.

## 1. Automated checks

Run on the branch: `yarn type-check`, `yarn lint`, `yarn test`. Any failure is a blocker.

## 2. Conventions checklist

- [ ] Route files in `src/app/` only re-export a screen — no logic/JSX
- [ ] Feature code under `src/features/[name]/`; component = folder with `.tsx`, `types.ts`, `index.ts`; imports via barrels
- [ ] Text via `Text` from `@/ui/components` with `variant`; no `fontSize`/`fontWeight`/`fontFamily` by hand
- [ ] Styles via Unistyles; no hex colours, raw px spacing or radius — `theme.*` only
- [ ] Icons via `Icon`; new icons generated with `yarn icons`
- [ ] All user-facing strings in i18n, keys present in **both** `en.json` and `uk.json`
- [ ] Zustand accessed via selectors (`useShallow` for multiple fields)
- [ ] Server data via React Query hooks in `src/hooks/query/` with `fetcher()`; query keys from the enum
- [ ] No `process.env` outside `env.ts` / `app.config.ts`; config via `CONFIG`
- [ ] Tokens only via `useAuthStore` / SecureStore — never MMKV or logs
- [ ] Tests: required for `src/utils/` and `src/ui/components/`; names = what + when + expected; query by role/text
- [ ] Commits follow Conventional Commits

## 3. Bugs and risks

Look for: missing loading/error/empty states, unhandled promise rejections, effects without cleanup, stale closures, list keys, unguarded optional data, secrets or tokens in code, accessibility (roles/labels on pressables), performance (inline functions in large lists, missing `keyExtractor`).

## 4. Report (short, lead-level)

1. **Verdict:** approve / approve with nits / changes required
2. **Blockers** — must fix (file:line, why, suggested fix)
3. **Should fix** — conventions and risks
4. **Nits** — optional

Only report issues you verified in the code. Don't fix anything unless asked.
