# Copilot Instructions

1. Never ask to start or restart the dev server — I will do that myself always.
2. After every major change, run a TypeScript type-check (`pnpm -w --filter ./... tsc --noEmit`) and report any errors, without asking for confirmation.
3. Dont add comments to code, if you find comments, remove then unless stricty necessary for understanding.
4. Prioritize redability and maintainability of code over brevity or cleverness.
5. When suggesting code, always use existing patterns and styles in the codebase.
6. Dont instruct user to restart dev server after making changes, I will do that myself when needed.
7. No hacky fixes or workarounds, if a problem is complex, suggest a proper solution even if it takes more time to implement.

Additional notes for Copilot:

- Prefer non-destructive edits and small, focused commits.
- When making edits that affect types or build config, run the type-check step above before finishing.
- Do not perform or suggest actions that require elevated permissions or kill user processes unless explicitly authorized.
