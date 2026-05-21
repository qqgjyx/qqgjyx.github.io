# BibTeX Parser Spike — Findings

> REDESIGN.md §6.3 pre-flight gate. Run 2026-05-21.

## Verdict

**LOCK: hand-rolled (priority-3 fallback).** Pass rate 38/38 on every custom field across all 6 entries in `citations.bib`. Implementation will live in `src/lib/bibtex.ts` during Weekend 1, mirroring the prototype at `_spike/parser-spike/spike.mjs` (the `tryHandRolled()` function).

## Spike scoreboard

| Parser | Pass | Mismatch | Missing | Verdict |
|---|---:|---:|---:|---|
| `@citation-js/core` | 0 | 0 | 38 | **Reject.** Normalizes to CSL JSON; drops every non-CSL field. The custom-field requirements (`display_anchor`, `display_authors`, `featured`, `equal_contribution`, ...) are core to our content model — non-negotiable. |
| `@retorquere/bibtex-parser` (default) | 34 | 4 | 0 | **Reject (defaults).** Custom fields survive, but LaTeX post-processing destroys two important shapes — see Gotchas. |
| `@retorquere/bibtex-parser` + `verbatimFields` | ~37 | ~1 | 0 | **Close.** URL + HTML preserved when the field is in `verbatimFields`. Still sentence-cases `title` / `booktitle` and leaves `{\dag}` as a literal LaTeX command in verbatim fields. Could work with more shimming, but the option matrix is fiddly. |
| **hand-rolled (Scholar-Lite-style)** | 38 | 0 | 0 | **LOCK.** Brace-balanced scanner. No LaTeX post-processing — values are byte-identical to source modulo BibTeX `{}` stripping. ~50 LOC. |

## Why hand-rolled, not retorquere with the right flags

The plan's priority order is `citation-js → retorquere → hand-rolled`. Retorquere mostly works with `verbatimFields: ['display_authors', ...verbatim list]` or `raw: true`. We chose hand-rolled anyway because:

1. **6 papers, ~1-2/year additions.** No dependency on `@string` macros, no `@preamble`, no need for structured author parsing beyond `split(' and ')`. The complexity retorquere brings (LaTeX→Unicode, sentence-casing, name parsing) is liability, not value.
2. **Determinism.** Hand-rolled output is byte-stable; retorquere's behavior depends on a half-dozen option flags interacting with field types. For a build-time data source that drives publication metadata, "what you write is what you get" wins.
3. **Zero dep, zero supply-chain risk.** No transitive deps, no Renovate noise, no future-breakage from upstream changes.
4. **Trivial to extend.** Adding a `@string` table or a date-coercion helper is ~10 lines if ever needed.

## Gotchas discovered (record for future)

These bit `@retorquere/bibtex-parser` with default options. Avoid them in any future parser work.

1. **URL `%20` truncation.** With default options, `https://...%20Tan/...` truncated to `https://...` (parser treats `%` as comment-start even inside `{...}` value). Fix: `raw: true` or add to `verbatimFields`.
2. **HTML angle brackets mangled.** `<strong>` → `¡strong¿` (U+00A1 inverted exclamation). LaTeX-to-Unicode mapping treats `<` `>` as math/active chars. Fix: `raw: true` or `verbatimFields`.
3. **Title sentence-casing.** `Brain-Inspired Perspective on Configurations` → `Brain-inspired perspective on configurations`. The outer `{...}` doesn't prevent it; need `sentenceCase: false`.
4. **LaTeX commands preserved literally in raw/verbatim modes.** `{\dag}` stays as `{\dag}` instead of rendering as †. For hand-rolled we'll use unicode `†` directly in the source `.bib`.

## Required-fields probed in spike

Spike script checks each entry's custom fields against ground truth extracted by hand:

- §3.3 custom fields: `pdf`, `code`, `poster`, `slides`, `video`, `project`, `awards`, `equal_contribution`, `display_anchor`
- Schema (§3.2) consumers: `venue_short`, `display_authors` (HTML probe), `featured`, `paperurl`, `arxivurl`, `track`, `date`

HTML probe specifically asserts `<strong>` / `<sup>` substrings survive on entries that have them.

## Weekend 1 carry-over: implementation plan for `src/lib/bibtex.ts`

Lift the `tryHandRolled()` body from `_spike/parser-spike/spike.mjs`. Add:

1. **Type signatures.** Result is `Record<CiteKey, RawFields>` where `RawFields = Record<string, string>`.
2. **Date coercion.** If `date` is present, use it. Else combine `year` + `month` (`month` may be a 3-letter name or abbrev — map `jul`→7, etc.).
3. **Authors → array.** `fields.author.split(/\s+and\s+/)` → `string[]`.
4. **`bibtex` field.** Re-emit each entry as a clean BibTeX string for the copy-to-clipboard button (§2.3). Trivial since we already have the source — slice from `@` to matching `}`.
5. **Zod adapter.** Feed result into the `publications` collection's Zod schema (§3.2) after merging with any optional `.md` override.

Estimate: 100-150 LOC in `src/lib/bibtex.ts`, no deps.

## Source-file convention nudges

To keep hand-rolled simple, write `citations.bib` entries with:

- **Unicode for special chars.** Use `†` not `{\dag}`, `&` not `\&`, em-dash `—` if ever needed not `---`. We never render through a LaTeX engine.
- **HTML in `display_authors` is the source of truth.** Don't double-encode with LaTeX commands inside HTML tags.
- **Cite key = `<lastname><year><shortname>`** lowercase, no separators (already enforced).
- **URLs in `{...}` braces.** Standard. No escaping needed.

## Spike artifacts (throwaway, OK to delete after Weekend 1)

- `_spike/citations.bib` — 6-entry draft used as fixture. **Promote to `src/content/citations.bib`** during Weekend 1 scaffold.
- `_spike/parser-spike/` — spike harness. **Delete** after `src/lib/bibtex.ts` is written and tested against the same fixture.
- This file (`_spike/FINDINGS.md`) — record. **Keep** until Phase C retro; folds into `RETRO.md` if useful.
