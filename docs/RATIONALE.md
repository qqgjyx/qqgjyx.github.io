# Design rationale

The "why" behind the major decisions, kept as a design memory.

## Why Astro

- **Zero JS by default** — academic homepages are content, not apps. Every line
  of shipped JavaScript is a tax on first-load performance, accessibility, and
  reader trust. Astro defaults to no client JS unless explicitly opted in.
- **Content Collections + Content Layer API** — typed content with Zod schemas
  at build time: autocomplete + frontmatter validation while editing markdown.
- **`astro:assets` image pipeline** — drop a `.png` / `.webp` / `.gif`, Astro
  emits AVIF + WebP + responsive `srcset` at build.
- **Fonts API** — Monaspace ships as a single variable woff2; the Fonts API
  serves it with proper preload hints and FOIT/FOUT mitigation.
- **Markdown-first authoring** — every collection (pubs, news, education,
  work, misc) is one markdown file per entry. Adding a paper is creating a new
  file, not editing a TS array.

## Why Catppuccin

Catppuccin is a community-driven color system originally designed for
terminals and editors. Adopting it on a website is a signal of dev/AI-culture
membership, but the deeper reason is craft: every Catppuccin port follows the
same spec, which means *the palette has thought through every UI role*. We get
a coherent design system for free.

Spec-strict mappings (see `src/styles/global.css`):

| Token              | Catppuccin role     |
|--------------------|---------------------|
| `--color-bg`       | Base                |
| `--color-fg`       | Text                |
| `--color-fg-muted` | Subtext 0           |
| `--color-link`     | Blue                |
| `--color-link-hover` | Sky               |
| `--color-card-bg`  | Surface 0           |
| `--color-rule`     | Overlay 0           |
| `--color-accent`   | Mauve (de-facto brand) |
| `--color-emphasis` | Peach (Latte) / Yellow (Mocha) |
| `::selection`      | Mauve @ 25% (brand deviation; spec is Overlay 2) |

Mauve is Catppuccin's *de facto* brand accent — the default in the VS Code,
Discord, and JupyterLab ports. It's a single `--color-accent` variable in
`global.css` if I ever want to retune it.

Latte (light) + Mocha (dark) is the canonical pairing. Auto via
`prefers-color-scheme`; manual override via the header toggle button, which
sets `:root[data-theme]` and persists the choice to `localStorage`. A small
inline script in `Base.astro` applies the saved theme before first paint to
avoid a flash. With JavaScript disabled the button is inert, but
`prefers-color-scheme` still drives the theme.

Emphasis color (venue highlights, awards, GitHub stars, bold news terms) uses
a dedicated `--color-emphasis` token: Peach in Latte, Yellow in Mocha. Latte
Yellow on the Base background is only ~2.4:1 contrast; Peach (~3.9:1) clears
WCAG AA at the bold/small sizes these accents use.

## Why Monaspace, full-mono

Monaspace is GitHub Next's 2023 mono superfamily — Neon (neo-grotesque), Argon
(humanist), Xenon (slab serif), Radon (handwriting), Krypton (mechanical) —
all sharing the same character widths and variable axes. Its signature feature
is *texture healing*: contextual OpenType lookups that swap glyph widths to
fix the structural ugliness of fixed-width fonts (narrow `i` wasting space,
wide `m` cramped) — read more at
[monaspace.githubnext.com](https://monaspace.githubnext.com/).

We use full-mono (every text, including H1) for visual identity. This is a
deliberate departure from the academic-Inter default that every other Astro
template ships. Tradeoffs:

- **Monospace body reads slower than proportional** at length. Mitigations:
  line-height 1.6, a constrained measure (the `<main>` column caps at 860px),
  body weight 380 (variable axis), and texture-healing OpenType features
  (`'calt' 1, 'ss01' 1, 'ss02' 1`). For a short personal homepage with ~30
  entries, this is acceptable. Long-form paper bodies should mix in a
  proportional font.
- **Monaspace's italic uses letterform swaps mid-slant** — beautiful, but
  unusual. Some readers find it surprising on first encounter.

## Why markdown-per-pub instead of one `.bib` file

Most academic templates assume a `.bib` file as the source of truth. I did
this originally (W1+W2) with a brace-balanced parser, then hit two problems:

1. **HTML payloads don't fit BibTeX.** `display_authors` wants
   `<strong>Self</strong><sup>†</sup>` to render bold-self + dagger for
   equal-contribution. BibTeX's `{...}` brace semantics are awkward for HTML.
2. **Adding a pub means editing a giant `.bib` file**, not creating a new
   markdown file like every other collection. The mental model is split.

Switching to markdown-per-pub unified the authoring model: every collection
(pubs, news, education, work, misc) follows the same pattern. The `bibtex`
field in pub frontmatter keeps the raw citation block, so the canonical BibTeX
is never lost. Net result: better authoring model, no loss of BibTeX fidelity.

## Why no top nav

The site is a single page. The longest sections (publications, news) are
~10-20 items each — total content fits in 1-2 viewport heights. A nav bar to
"jump to sections" is solving a problem that doesn't exist for content this
small. Jon Barron's [jonbarron.info](https://jonbarron.info) — the template
most ML researchers copy — has no nav for the same reason.

## Why `~ · ~` between content and footer

A single ASCII flourish, between the last section and the footer. Reads as a
cat face (whiskers + nose), which is the Catppuccin in-joke. One use only —
sprinkling them between every section reads as amateur Tumblr-coded; a single
one above the footer reads as deliberate signature.

## Why no Pagefind, no MDX, no View Transitions

These are great Astro features when the site has scale. For ~30 entries on a
single page, they're overhead. Pagefind = Cmd+F is enough. MDX = no rich
markdown body needed beyond the news/misc bullets. View Transitions = only
useful between pages, and we have one page.

Any of them can be added later via the standard `npx astro add <integration>`
command if the site ever outgrows a single page.

## Why some lists are TS, not content collections

Pubs, news, education, work, and projects are markdown collections. Honors,
service, and the author→URL lookup (`src/data/*.ts`) stay as small typed TS
arrays instead. They're ~80 trivial lines with no body content; a full
collection (loader + Zod schema + per-entry markdown files) would be more
machinery than the data warrants. Markdown-per-entry earns its keep when an
entry has a *body*; these don't.
