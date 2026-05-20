# XPACE Design System

> **"Mova-se Além dos Limites."** — XPACE Escola de Dança & Dance Company.

XPACE is a Joinville-SC dance school and competition crew operating under a single brand with three sub-marques:

| Sub-brand | Lockup | What it does |
|---|---|---|
| **XPACE Escola de Dança** | `XPACE` over wide-tracked sublabel | The school. Hip Hop, Jazz Funk, K-Pop, Heels, Ballet, Dancehall, fight classes. Ages 3+. |
| **XPACE Dance Company** | `XPACE` italic + `COMPANY` | The competition arm — Brazilian Hip Hop selection, FIH2 / HHI Brasil finalists. |
| **XPACE PRO** | `XPACE PRO` (gold/acid green) | Incubator for elite-level projects (e.g. *VYBZ* Dancehall film by Lucas Maciel). |

The visual identity (codename **"Holographic Evolution / 2026"**) is brutalist + cyberpunk + premium streetwear: deep blacks, holographic purple→pink→orange triad, chamfered "clip-path" corners, neon glow shadows, and Chillax/Steelfish/Poppins typography.

## Sources

This design system was assembled from:

- **Brand identity package** — `jonathanfferreira/xpace-landing-page` repo, folder `identidade-2026/` (logos, fonts, palette board, gradient backgrounds).
- **Marketing site** — same repo, `components/` and `src/components/` (React 19 + Vite + Tailwind v4 + Framer Motion + Lucide). This is the canonical reference for hero, navbar, pricing, schedule, manifesto, performances and footer.
- **Product platform / monorepo** — `jonathanfferreira/xpacedance` (Next.js 14 + Supabase + React Native, codename **XTAGE** — the gamified e-learning holo-deck for students). Same `02. IDENTIDADE/` folder ships the same fonts/logos.
- **Live demo** — `https://xpace-premium-96518327-b22be.web.app`.

Files in those repos are not pre-loaded here — only the assets we actually use have been copied into `assets/` and `fonts/`.

---

## Index

| File / folder | Purpose |
|---|---|
| `README.md` | This file. Brand context + content & visual foundations. |
| `colors_and_type.css` | Source-of-truth tokens for color, type, spacing, radii, shadows, gradients, motion. |
| `fonts/` | Chillax (display), Poppins (body), Steelfish (tech/UI). |
| `assets/logo/` | All XPACE logo lockups (master, perfil, símbolo, XP, Company, ON) in white + black. |
| `assets/decor/` | Stickers, arrow, board, palette board, company sticker. |
| `assets/backgrounds/` | Gradient backgrounds (e.g. 1920×1080 holographic haze). |
| `assets/photos/` | Brand-prompt photography references. |
| `preview/` | One HTML card per design-token / component cluster — populates the Design System tab. |
| `ui_kits/site/` | UI kit recreating the marketing site (Hero, Navbar, Pricing, Schedule, Footer, etc). |
| `slides/` | Sample slide templates using the brand. (Created only if a deck template was shared.) |
| `SKILL.md` | Cross-compatible skill manifest for Claude Code. |

---

## CONTENT FUNDAMENTALS

XPACE writes like a streetwear drop crossed with a manifesto. Bold, short, emphatic. **Brazilian Portuguese** is the primary voice; English appears as a stylistic flourish ("DANCE COMPANY", "Best Value", "STATUS: ACTIVE"), never as the lead.

### Tone
- **Brutalist hype**, not polished corporate. The brand is loud, confident, a little theatrical.
- **Direct address using "você"** is rare; copy speaks in the imperative ("MOVA-SE", "ESCOLHA SEU PLANO", "AGENDAR AULA AGORA") or in the "we / nós" collective ("SOMOS MAIS DO QUE...").
- **Adrenaline metaphors** mixed with **tech metaphors**: "código XPACE", "ID: XP-PRO-001 // SYSTEM: ACTIVE", "holo-deck", "Identity Shield", "máquina de vendas".
- The brand is unironic about its ambition — it calls itself "a elite", "a incubadora de talentos", "a maior potência das danças urbanas da região". Lean into that confidence.

### Casing
- **Display copy and section headers: ALL CAPS.** Always. Body copy in product is also frequently uppercased (`body { text-transform: uppercase; }` is set in the marketing site).
- **Eyebrow/category labels: ALL CAPS, wide letter-spacing** (`0.18em`–`0.25em`).
- Long-form descriptive copy (manifesto paragraphs, about pages) stays in sentence case for readability — but the headlines wrapping them are uppercase.
- Numbers/prices: large, tight, often with smaller "/mês" suffix in muted grey.

### Word patterns
- **Three-word manifestos**: "MOVA-SE / ALÉM DOS LIMITES." "DIVERSÃO. DISCIPLINA. RESPEITO." "FAMÍLIA. COMPROMISSO. DEDICAÇÃO."
- **Slash separators** for tags: "01 // VISÃO", "Cinema XPACE // Live Records", "ID: XP-PRO-001 // SYSTEM: ACTIVE".
- **Bracketed asides** in editorial copy: "[DADOS TÊM MOSTRADO QUE CADA VEZ MAIS PESSOAS ESTÃO PASSANDO SEU TEMPO PRESAS AO USO DE TELAS]."
- **"X" prefix everywhere**: XPACE, XPERIENCE, XLAB, XCORE, XTAGE, XP, XPACEFLIX. The `X` is a logo-graphic, a room name, a watermark, a section marker.
- **Bilingual signature lines**: "Redefining movement through technology and passion. Junte-se ao futuro da educação em dança."

### Vibe samples (verbatim)
- Hero: *"MOVA-SE ALÉM DOS LIMITES. Educação em Dança Impulsionada por Tecnologia Premium."*
- Manifesto: *"SOMOS MAIS DO QUE APENAS UMA ESCOLA DE DANÇA — SOMOS UM ESPAÇO QUE OFERECE UMA NOVA EXPERIÊNCIA DE DANÇA, UMA QUE TRANSFORMA MOVIMENTOS EM ARTE."*
- Pricing badge: *"PASSE LIVRE — Acesso Ilimitado. R$499/mês. QUERO SER VIP."*
- Footer micro: *"© 2025 ESCOLA XPACE."*
- CTA: *"PRIMEIRA AULA GRATUITA — Sem compromisso necessário."*

### Emoji
**Almost never in product UI.** The marketing site has zero. Repo READMEs use them generously (🚀💻🌌⚡💸🛡️) but only as headings in developer documentation — not in user-facing copy. **Default: do not use emoji** in slides/UI/marketing; if you need a glyph, use a Lucide icon, a Material Symbol, or one of the brand stickers (XP, ON, ARROW, COMPANY).

---

## VISUAL FOUNDATIONS

### Color
A **three-tier color system**:

1. **Holographic triad (primary)** — purple `#6324B2` → pink `#EB00BC` → orange `#FF5200`. Used as flat fills, gradient sweeps, neon glow shadows, and dot legends. Code aliases: `--xp-purple` (primary), `--xp-pink` (secondary / cyber-pink), `--xp-orange` (tertiary / accent).
2. **Neutrals** — true black `#050505` and clean white `#FFFFFF`, with a near-black `#0A0A0A` surface and `#F8F8F8` light surface. Mid-greys (`#666` muted-light, `#A0A0A0` muted-dark) for secondary text.
3. **Hype accents** — `#FFD700` gold (PASSE LIVRE / VIP plan), `#00FF00` acid green (XPACE PRO program), `#22C55E` WhatsApp green (booking action).

Avoid bluish-purples; the system reads warm-magenta. Background pages get a faint **purple haze** — two `radial-gradient` blobs at 3% opacity over the base color.

### Type
- **Chillax** — display headings. Variable, weights 200–700. UPPERCASE, tight tracking (`-0.02em`), line-height ≤1. This is the "title" font. *Black weight + letter-spacing -0.03em* on prices.
- **Steelfish** — tech/UI labels, navigation, buttons, eyebrows, numeric ticker. Condensed, masculine, very wide tracking (`0.18em`–`0.25em`). Outline cut available for layered watermarks.
- **Poppins** — body. Used at `font-bold` (700) far more than at regular — XPACE body copy is *uppercase + bold + wide-tracked* even when it's "body".

Sizes scale freely with `clamp()`. Hero h1 is genuinely massive (up to 144px / 9vw), and sections often have a 20vw watermark "X" or "XPACE RECORDS" floating behind content.

### Spacing & layout
- **4px base spacing**, tokens 4 → 128.
- **Wide section padding** — sections are ≥ `py-32` (128px) on desktop, with internal grids at 4-col / 2-col / 1-col responsive.
- **Container** — `max-w-7xl` (1280px) centered with horizontal `px-4 sm:px-6 lg:px-8`.
- **Bordered legends** — small horizontal bars (`h-px w-8 bg-primary`) and dotted/dashed dividers separate eyebrow text from headline.
- **Grids over flex** — `grid grid-cols-1 md:grid-cols-3` is everywhere for plan tiers, feature cards, schedule.
- **Sticky / fixed** — top navbar fixed `z-50` with `backdrop-blur-xl` and `bg-bg/90`. Floating WhatsApp button bottom-right. Custom cursor on `pointer:fine`.

### Backgrounds
- **Default page**: solid `--xp-bg` + the dual-blob purple haze.
- **Cinematic sections** (Performances, XPACE PRO): pure black with a single big pulsing primary-color blob blurred at ~120px.
- **Imagery**: full-bleed photos in CTAs and hero gallery, `object-cover` with multiply blends and `bg-gradient-to-t from-black/90 via-black/20 to-transparent` overlays for text legibility.
- **Texture**: `bg-noise` (a tiny noise PNG) at low opacity over premium cards adds a paper/film grain.
- **No painted illustrations.** No emoji-cards. No bluish-purple SaaS gradients. The haze is faint; the foreground is hard contrast.

### Imagery treatment
- Crew & teacher portraits: default **grayscale**, hover transitions to color. Always shot top-aligned (face fills the upper half of the frame).
- Performances: **YouTube `hqdefault` thumbnails** with a black/60 overlay, primary-pink play-button on hover, scaled `1.1` on hover.
- Galleries: gap-free masonry / 2-col staggered layout, all `rounded-2xl` corners, hover `scale-[1.02]`.
- The brand reads **warm + dark**, almost never airy or pastel. Light-mode pages still use bold black-on-white blocks with magenta accents.

### Animation & motion
- **Easing**: out-expo-ish `cubic-bezier(0.22, 1, 0.36, 1)` is the default; `cubic-bezier(0.34, 1.56, 0.64, 1)` for spring overshoot.
- **Durations**: 180ms (hover), 300ms (default), 500–700ms (cinematic reveals).
- **Signature animations**: `float` (6s), `glow` (3s alt — purple glow → pink glow), `pulse-slow` (4s brightness), `glitch` (clip-path stutter on hero text), `marquee` (infinite scrolling tech-band), `shimmer` (gold sweep on VIP).
- **Framer Motion** drives every section reveal: `initial={{opacity:0, y:50}} whileInView={{opacity:1, y:0}}` with `viewport={{once:true, margin:"-100px"}}` and 0.6–0.8s `duration`. Cards stagger by `delay: index * 0.2`.
- **MagneticButton** wraps CTAs (mouse-pull translate). **TiltCard** wraps premium cards (3D tilt on cursor).

### Hover & press states
- **Hover**: `-translate-y-2`, `scale-[1.02]` or `scale-[1.05]`, `brightness-110`, plus a colored glow (`shadow-neon`, `shadow-[0_0_30px_rgba(...)/0.3]`). On grayscale imagery: removes grayscale and shows an Instagram icon overlay. On nav links: a 0→100% underline sweep in primary color. On dark CTAs: gradient halo blur intensifies (`group-hover:opacity-100`).
- **Press**: `active:scale-95` or `active:scale-[0.98]`. No color change on press; the scale alone reads as "click".
- **Focus**: not heavily styled — accessible focus is a known weak spot. Treat it as an opportunity (use a 2px primary outline).

### Borders & shadows
- **Borders** are 1px hairlines in light theme (`border-gray-200`) or near-black in dark theme (`border-gray-800`). Premium cards bump to `border-2` and tint to a brand color (purple/pink/gold).
- **Feature cards** use a **4px left-border accent** in the brand color paired with a faded full-card background icon at 5% opacity in the top-right.
- **Shadows**: subtle on light cards (`shadow-sm/lg`), neon-tinted on dark cards (`shadow-[0_0_30px_rgba(127,0,255,0.3)]`). Inner shadows are not used.
- **No "rounded card with colored left-border only" SaaS trope** — when XPACE uses a left accent, it pairs with chamfered corners and a brand icon, never alone.

### Corner radii & cuts
Two systems coexist:

- **Chamfered "clip-path" cuts** (cyber-cards, cyber-buttons): `polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)`. This is the "ticket" / "tag" feel and is the brand's hallmark.
- **Rounded radii** for friendly contexts: `rounded-xl` (12px), `rounded-2xl` (16px), `rounded-3xl` (24px), `rounded-full` (pills, dots, avatars). CTA pills are common.

### Transparency, blur, gradients
- **Glass panels**: `bg-white/5 backdrop-blur-xl border-white/10` with a 135° purple-tinted gradient. Used on navbars and overlay badges.
- **Gradient halo** behind primary CTAs: an absolute `-inset-0.5` div with `bg-gradient-to-r from-primary to-secondary blur opacity-75 group-hover:opacity-100`.
- **Gradient text** clips on key words: `from-primary via-cyber-pink to-orange` or `from-[#FFD700] to-[#00FF00]`. Used to highlight one or two words inside an otherwise solid headline.

### Layout signatures
- **Pricing tier card**: chamfered, with two faux "ticket cutouts" (`absolute -left-2 top-1/2 w-4 h-8 bg-black rounded-r-full`) and a dashed dotted divider — sells the "this is your pass" metaphor.
- **Marquee**: a black `py-10` band of Steelfish hype phrases separated by colored dots, scrolling infinitely.
- **Watermark glyph**: a single huge `X` (or word like "XPACE RECORDS") at 15–20vw, 5% opacity, behind a section.
- **Feature dossier card**: chamfered, 4px left-accent in brand color, faded icon in upper right, bordered description with `border-l pl-4`, dashed bottom divider with reveal-on-hover "Saiba Mais →".
- **Magic ticket** (PASSE LIVRE): gold gradient outer border + inner solid black, animated shimmer sweep, gold text, white CTA → gold on hover.

---

## ICONOGRAPHY

XPACE uses **three icon sources** intermingled — and that's intentional, not sloppy:

1. **Material Symbols Outlined** (Google) — for high-frequency UI verbs and contextual chips: `arrow_forward`, `school`, `dark_mode`, `light_mode`, `mail`, `call`, `location_on`, `play_arrow`, `open_in_new`, `menu`, `close`, `festival`, `movie_creation`, `emoji_events`. Loaded via the standard Google Fonts CDN: `<link href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined" rel="stylesheet">`.
2. **Lucide React** — for Framer-driven sections (Performances, Teachers, Schedule's WhatsApp action, Awards): `Play`, `Trophy`, `Star`, `ExternalLink`, `Instagram`, `MessageCircle`. Stroke-based, 1.5–2px weight. CDN: `https://unpkg.com/lucide@latest`.
3. **Brand glyphs (PNG)** — the XPACE logos themselves work as icons in headers, social avatars, and stickers. Located in `assets/logo/` and `assets/decor/`. Available shapes:
   - `xpace-logo-{white,black}.png` — primary wordmark
   - `xpace-perfil-{white,black}.png` — vertical profile lockup (used in the navbar — preferred over the wordmark for compact contexts)
   - `xpace-symbol-{white,black}.png` — abstract symbol-only mark
   - `xpace-xp-{white,black}.png` — minimal `XP` badge
   - `xpace-on-{white,black}.png` — `ON` status sticker
   - `xpace-company-{white,black}.png` — Dance Company wordmark
   - `xpace-arrow.png`, `xpace-sticker.png`, `xpace-company-sticker.png` — decorative juvenile stickers (used as floating accents on heroes and cards, often `animate-bounce` or rotated -2°)

**Usage rules:**
- Mix Lucide and Material Symbols freely — but pick **one per component**, not within a single button. The site does this consistently (Hero CTA uses Material `school`, Performances uses Lucide `Trophy`).
- Icon size matches the local text: `text-sm` icons sit next to `text-sm` labels; `text-3xl` next to a card eyebrow.
- **Chip-with-icon** pattern: `<icon> EYEBROW LABEL` separated by `gap-3`, with the icon colored to the section's brand accent (e.g. orange for "EDUCAÇÃO", pink for "CRIATIVO").
- **Stickers** are placed as `position: absolute` accents — `-top-16 -right-16`, scale on hover, sometimes `animate-bounce` with a slow `animationDuration: '3s'`.
- **Emoji**: never in user-facing UI. Only in repo READMEs.
- **Unicode glyphs**: used very rarely as visual punctuation — `∅` for empty states, `//` as separators, dots `•` and `–` between meta info.

If you build a new component and need an icon, check Material Symbols first (broadest coverage), then Lucide (better stroke weight for cards/CTAs), then fall back to a brand glyph. **Do not draw icons by hand in SVG** — use a real icon font or substitute the closest match and flag it.
