# Artifact Review Checklist

Do not mark a feature or task as complete until these checks pass manually or via automated runs.

## Code Quality & Safety
- [ ] No `any` types used (or strictly justified with `unknown` and type guards).
- [ ] Protected files/directories were not modified without permission.
- [ ] No existing unrelated tests were deleted or skipped.
- [ ] Code remains modular and aligned with established architecture.

## Execution & Testing
- [ ] Application compiles without fatal errors.
- [ ] Linter passes (`npm run lint` or equivalent).
- [ ] Type check passes (`tsc --noEmit` or equivalent).
- [ ] Related unit/integration tests pass.
- [ ] UI is responsive on desktop and mobile viewports (if applicable).

## Artifact Handoff
- [ ] `MEMORY.md` updated with architectural decisions and milestone progress.
- [ ] Obsolete specs are archived or marked resolved.
