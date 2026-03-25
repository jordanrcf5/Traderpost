# Project Brief (Persistent)

- **Product vision:** Give serious traders one platform for journaling, analytics, and community so they stop context-switching across multiple tools.
- **Target audience:** Active traders (full-time, part-time, or learning seriously) who want pro tooling without multiple subscriptions.

## Coding Conventions
- TypeScript-first, strict typing, no `any`.
- Keep routes thin; place reusable logic in `lib/` and feature modules.
- Use feature-oriented components (`components/journal`, `components/analytics`, etc.).
- Follow consistent naming: PascalCase for React components, camelCase for utility functions, kebab-case for route segments.

## Quality Gates
- Lint and type check on every meaningful change.
- Add tests for critical utility and business logic.
- Never ship placeholder data/content.
- Security requirements are not optional (RLS, auth checks, input validation, secret handling).

## Key Commands
- `npm install`
- `npm run dev`
- `npm run lint`
- `npm test`
- `npm run build`

## Workflow Expectations
- Work in small vertical slices by feature.
- Start each new task with a brief plan.
- Verify each slice immediately after implementation.
- Track milestone decisions in `MEMORY.md`.
- Keep docs current as architecture evolves.

## Design Requirements
- Dark-first UI with focused, professional tone.
- Data-forward layouts with clear hierarchy and whitespace.
- Accent green for positive/action states (`#00C896`).
- Avoid distracting animations or visual clutter.
