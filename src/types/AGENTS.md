<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# types

## Purpose

Hand-written TypeScript declarations for the published package.

## Key Files

| File | Description |
|------|--------------|
| `index.d.ts` | Manually maintained (not generated). Copied verbatim to `dist/index.d.ts` by the `build` script (`cp src/types/index.d.ts dist/index.d.ts`), after `tsup` runs with `dts: false`. |

## For AI Agents

### Working In This Directory
- If you change a public export's shape (new prop, renamed hook return field, etc.) in
  `src/`, update this file in the same change — nothing regenerates it automatically,
  and CI does not currently fail if it drifts (see root `AGENTS.md` testing notes).
- `.github/workflows/publish.yml` hard-fails the publish job if this file is missing,
  so don't delete it even temporarily.

<!-- MANUAL: -->
