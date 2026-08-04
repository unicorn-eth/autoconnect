<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# workflows

## Purpose

GitHub Actions CI/CD.

## Key Files

| File | Description |
|------|--------------|
| `test.yml` | Runs on push/PR to `main`/`develop`. Matrix over Node 18.x/20.x. Steps run `pnpm lint`, `pnpm type-check`, `pnpm test` — **each piped through `\|\| echo "... not configured yet"`**, so none of them can fail the build; only the `pnpm run build` step is a real gate. A separate `lint` job and a `build-examples` job (builds `src/examples/*` and uploads artifacts) also run. |
| `publish.yml` | Triggers on GitHub release publish or manual `workflow_dispatch`. Bumps `package.json` version from the release tag if needed, verifies `src/types/index.d.ts` exists and `dist/` build output is present, skips publish if the version is already on npm, then `npm publish --provenance --access public`. |

## For AI Agents

### Working In This Directory
- A green `test.yml` run does **not** mean lint/types/tests passed — see root
  `AGENTS.md` testing notes. If you're asked to "make CI actually catch things," this is
  the file to fix (remove the `|| echo` fallbacks once real `lint`/`type-check`/`test`
  scripts exist in `package.json`), not a place to add more soft-fail steps.
- `publish.yml` requires `NPM_TOKEN` as a repo secret; don't add publish steps that
  bypass the `steps.already.outputs.exists == 'false'` guard (it prevents
  re-publishing an existing version, which npm rejects anyway).

<!-- MANUAL: -->
