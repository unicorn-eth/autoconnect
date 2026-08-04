<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-07-27 | Updated: 2026-07-27 -->

# docs

## Purpose

Archive of dated, session-generated documentation: bug-fix writeups, migration guides,
workshop slide decks, and per-version release notes. This is historical reference, not
living documentation — several files here duplicate root-level files of the same or
similar name (e.g. `docs/fixes/RELEASE_NOTES_v1.2.0.md` and
`docs/guides/RELEASE_NOTES_v1.2.0.md` both exist alongside root `RELEASE_NOTES_*.md`
files) and none of them are guaranteed current.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `context/` | Point-in-time context summaries from past work sessions — see `context/AGENTS.md` |
| `fixes/` | Bug-fix summaries per version — see `fixes/AGENTS.md` |
| `guides/` | Migration guides and workshop material — see `guides/AGENTS.md` |
| `technical/` | Deeper implementation notes (smart-account signatures, delegation analysis) — see `technical/AGENTS.md` |

## For AI Agents

### Working In This Directory
- Don't treat anything here as an authoritative description of *current* behavior —
  cross-check against the actual source in `src/` before relying on a claim made in one
  of these docs. Prefer `CLAUDE.md` / root `AGENTS.md` for current guidance.
- If documenting a new fix or migration, prefer adding to `CHANGELOG.md` over creating
  a new dated file here — this directory has already accumulated redundant
  near-duplicate release notes across `fixes/` and `guides/`.

<!-- MANUAL: -->
