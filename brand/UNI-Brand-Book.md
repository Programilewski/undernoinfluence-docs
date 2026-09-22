# Under No Influence — Brand Book

**Version 1.0 · 2026-06-01**

The single reference for how *Under No Influence* (UNI) looks and sounds. Every value
below is taken directly from the live application design tokens
(`resources/css/app.css`) so this document and the product never drift apart.

---

## 1. Brand at a glance

**Under No Influence** helps people discover bars, restaurants and cafés with a
genuine alcohol-free offer. The brand is confident, modern and a little defiant — the
name itself is the statement. Visually that translates to a clean, high-contrast
interface, a single decisive purple, and one signature gesture: the emphasised **NO.**

| | |
|---|---|
| **Name** | Under No Influence |
| **Short form** | UNI |
| **Signature mark** | **NO.** (the highlighted fragment of the wordmark) |
| **Primary colour** | Violet `#7c3aed` |
| **Core typeface** | Poppins (corrected 18.08 — the book said Inter, the code says Poppins) |
| **Modes** | Light & dark are equal first-class citizens |

---

## 2. Mission — the thing everything else answers to

**UNI exists to promote the healthy choice.** Not products, not brands, not producers, not even venues. Those are instruments. A venue appears here because it helps somebody make that choice; a product appears because it is what they would choose. Neither is the point.

**Harm reduction, not abstinence.** Helping somebody find an alternative asks far less of them than asking them to stop, and partial substitution is a recognised harm-reduction outcome. **UNI takes no public position on alcohol policy** — our subject is what a person can order tonight. **Two non-alcoholic drinks and two alcoholic ones instead of four alcoholic ones is a success** — not a partial one.

**The mission does not come from what we do.** If promoting the healthy choice one day means an e-commerce catalogue, or talking to people on the street, that is what UNI does. The current form is a hypothesis about method, not an identity.

**We monetise — honestly when asked, never as a boast.** The mission needs the project to survive, and we do not hide that behind non-profit framing: asked directly, we answer directly. But it is never volunteered, never a headline, and we make no public forward-looking statements about revenue models — a published commitment hardens into an expectation, and a mission-shaped product whose loudest sentence is about money invites the cynicism that makes people ignore it. Revenue comes from selling venues honest information about their own visibility, never from compromising the choice. **No paid ranking, no paid inclusion, no brand-funded placement.**

See [[decisions/product/mission-is-the-healthy-choice]].

---

## 3. Brand character

**Faceless by design.** There is no founder persona, no influencer, no face. The value comes
from the system and the data — UNI is an authority on NoLo availability, not a lifestyle brand.
Venue owners promote UNI because it makes *them* look good, not because a personality endorsed
them. See [[decisions/product/faceless-brand]].

**Blend in, not stand out.** Premium, non-activist, non-preachy. We are not here to make a point about drinking; we are here to answer a question about what is on the menu. **This is not in tension with the mission — it is the mission's method.** The moment UNI reads as activism it stops reaching the person who was going to have four beers.

**Campaign concept:** "Under No ___" with rotating words.

### 3.1 What UNI is not

- Not a review platform — Google Maps and TripAdvisor already do that. See [[decisions/adr/ADR-006 No Reviews V1]].
- Not a social network for sober-curious people.
- Not a wellness app with soft pink aesthetics.
- Not a map app competing with Google on geography.

---

## 4. Logo

### 3.1 Wordmark

The primary logo is a two-line wordmark set in custom letterforms (delivered as inline
SVG, not a font):

```
UNDER NO.
INFLUENCE
```

The fragment **NO.** is rendered in the accent violet (`#825fff`); the remaining
letters use `currentColor`, so the mark inherits the surrounding text colour — black on
light backgrounds, near-white on dark. This is why the logo works in both modes without
a separate asset.

- **Source of truth:** inline SVG in `resources/views/partials/nav.blade.php`
  (viewBox `0 0 164 54`).
- The `.fill-accent` class drives the **NO.** emphasis — never hard-code it, so it
  tracks the accent token.

### 3.2 App mark / favicon

For small square contexts (browser tab, home-screen icon, social avatar) the full
wordmark sits on a rounded dark tile (`#141720`): white letters with **NO.** in violet,
exactly as the logo appears on a dark surface.

- `public/favicon.svg` — primary, scalable
- `public/favicon.ico` — 16/32/48 px legacy bundle
- `public/apple-touch-icon.png` — 180 px
- `public/icon-192.png`, `public/icon-512.png` — PWA / Android

### 3.3 Clear space & don'ts

- Keep clear space around the wordmark equal to the height of the **N**.
- **Don't** recolour **NO.** to anything but the accent token.
- **Don't** stretch, rotate, add shadows, or place the wordmark on a busy photo without
  a solid backing.
- **Don't** rebuild the wordmark in a system font — always use the supplied SVG.

---

## 5. Colour

All colours are CSS custom properties. Brand colours (`primary`, `accent`) **do not
flip** between modes; neutrals do.

### 4.1 Brand

| Token | Hex | Use |
|---|---|---|
| `--color-primary` | `#7c3aed` | Primary actions, links, brand fills, Filament primary |
| `--color-primary-hover` | `#8b5cf6` | Hover state |
| `--color-primary-active` | `#6d28d9` | Pressed / active state |
| `--color-primary-muted` | `#a78bfa` | Secondary emphasis |
| `--color-primary-light` | `#c4b5fd` | Tints, subtle backgrounds |
| `--color-accent` | `#825fff` | The **NO.** mark, CTAs, accent borders |
| `--color-ok` | `#00b5ff` | Positive / informational signal |

### 4.2 Drink categories

A fixed, semantic palette — each drink type always wears the same colour across maps,
badges, tiles and charts.

| Token | Hex | Category |
|---|---|---|
| `--color-drink-piwo` | `#B87A5E` | Piwo (beer) |
| `--color-drink-wino` | `#9b6b9b` | Wino (wine) |
| `--color-drink-spirits` | `#7c9b5e` | Spirits |
| `--color-drink-drinks` | `#5e8db8` | Drinks / cocktails |
| `--color-drink-cydr` | `#b8a25e` | Cydr (cider) |
| `--color-drink-musujace` | `#5eb8a2` | Musujące (sparkling) |

### 4.3 Neutrals — light mode

| Token | Hex / value | Use |
|---|---|---|
| `--color-base` | `#f7f8fb` | Page background |
| `--color-surface` | `#ffffff` | Cards, panels |
| `--color-surface-hover` | `#eef2f7` | Hover surface |
| `--fg` | `#0D0F14` | Primary text |
| `--fg-muted` | `rgba(13,15,20,.75)` | Secondary text |
| `--fg-subtle` | `rgba(13,15,20,.64)` | Tertiary text |
| `--fg-faint` | `rgba(13,15,20,.48)` | Hints, placeholders |
| `--ui-border` | `rgba(13,15,20,.10)` | Default borders |

### 4.4 Neutrals — dark mode

| Token | Hex / value | Use |
|---|---|---|
| `--color-base` | `#0D0F14` | Page background |
| `--color-surface` | `#141720` | Cards, panels |
| `--color-surface-hover` | `#1e2230` | Hover surface |
| `--fg` | `#e8e4df` | Primary text (warm off-white) |
| `--fg-muted` | `rgba(232,228,223,.72)` | Secondary text |
| `--fg-subtle` | `rgba(232,228,223,.55)` | Tertiary text |
| `--fg-faint` | `rgba(232,228,223,.42)` | Hints, placeholders |
| `--ui-border` | `rgba(255,255,255,.08)` | Default borders |

> **Contrast:** foreground tokens are tuned to meet WCAG AA on both `base` and
> `surface`. When introducing a new text/background pair, re-check AA.

---

## 6. Typography

| Role | Typeface | Weights | Notes |
|---|---|---|---|
| UI & body | **Poppins** | 400 / 500 / 600 / 700 / 900 | Corrected 2026-08-18: the token is `--font-sans: 'Poppins'` in `resources/css/app.css:54`, not Inter. Five weights are actually used in `resources/views/`, no italics. Note the app currently loads **five font families** from Bunny Fonts and uses one — a pre-launch fix, see `roadmap/pre-launch-checklist.md` point 4. Whether Poppins is the right face at all is still open: the wordmark is a compact grotesque, Poppins is a geometric sans. |
| Display | **Brawler** | 400 / 700 | Loaded via Bunny Fonts for editorial / display moments. |
| Mono | system mono | 400 | Code, slugs, technical strings (`font-mono`). |

**Weight usage in product** (by frequency): `font-bold` (700) for emphasis and nav,
`font-semibold` (600) for headings and labels, `font-medium` (500) for subtle emphasis.
Keep body copy at 400.

**Hierarchy principle:** establish hierarchy with weight and size, not colour. Reserve
the violet for things that are actually interactive.

---

## 7. Design Principles

**Shape.** Rounded corners for B2C — `rounded-xl` for cards, `rounded-full` for pills and
buttons, `rounded-lg` for bars and inputs. Sharp/default corners for the B2B Filament dashboard;
it uses Filament's native design system rather than the consumer look.

**Bars.** Breadth and decay bars use the single accent colour. Length communicates the value —
never red/green colour coding.

**Only show what is present.** Never render an absent category greyed out, and avoid empty
states that enumerate what a venue lacks. See [[decisions/product/show-only-present]].

**Icons.** Lucide or Phosphor for V1. A custom icon set is deferred.

**Map.** CartoDB Dark Matter tiles via Leaflet — chosen to match the dark brand surface. See
[[decisions/product/dark-map-tile-provider]].

---

## 8. Dark mode

Dark mode is not an afterthought — the token system flips on `.dark` applied to
`<html>` before first paint (no flash). Rules:

- Brand violet and the drink palette stay identical in both modes.
- Never hard-code `#fff`/`#000` for text or surfaces — use the `fg`/`surface` tokens.
- Test every new component in both modes before shipping.

---

## 9. Voice & tone

- **Confident, not preachy.** We help people choose; we don't lecture about alcohol.
- **Plain and specific.** "25 venues in Warszawa with a real 0.0% list" beats vague
  marketing language.
- **Polish-first.** The product UI is in Polish (`lang="pl"`); category names use the
  Polish term (Piwo, Wino, Musujące…).
- The name does the attitude. Let **NO.** carry the edge so the rest of the copy can be
  helpful and warm.

---

## 10. Asset inventory

| Asset | Path |
|---|---|
| Wordmark (SVG, inline) | `resources/views/partials/nav.blade.php` |
| Favicon (SVG) | `public/favicon.svg` |
| Favicon (ICO) | `public/favicon.ico` |
| Apple touch icon | `public/apple-touch-icon.png` |
| PWA icons | `public/icon-192.png`, `public/icon-512.png` |
| Design tokens (source of truth) | `resources/css/app.css` |
| Filament panel theme | `resources/css/filament/panel/theme.css` |

> **Maintenance rule:** colours and type live in `resources/css/app.css`. If a value
> here disagrees with that file, the file wins — update this book to match.
