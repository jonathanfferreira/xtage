# XPACE Site — UI Kit

A pixel-faithful recreation of the XPACE marketing site (Joinville-SC dance school). Rebuilt from `jonathanfferreira/xpace-landing-page` (React 19 + Vite + Tailwind v4 + Framer Motion + Lucide).

Open `index.html` for a click-thru of the homepage.

## Components

| File | What it is |
|---|---|
| `Navbar.jsx` | Fixed top nav with `xpace-perfil-white` lockup, link underline sweep, theme toggle, "Garantir Anual" CTA. |
| `Hero.jsx` | Massive Chillax headline with gradient-clip word, dual CTAs, full-bleed photo on the right with overlay gradient and floating XPACE sticker. |
| `Marquee.jsx` | Black band of Steelfish hype phrases scrolling infinitely with colored dot separators. |
| `Manifesto.jsx` | Section with watermark X, eyebrow, large headline + bracketed editorial paragraph. |
| `FeatureGrid.jsx` | The four "rooms": XPERIENCE / XLAB / XCORE / XTAGE — chamfered cards with 4px left accent, faded brand icon and dashed divider. |
| `Pricing.jsx` | Three plans: Mensal / Trimestral / Anual + the gold "PASSE LIVRE" magic ticket. Chamfered + ticket-cutout sides. |
| `Footer.jsx` | Black band, big watermark `XPACE`, columns of nav links, social icons, copyright. |

## Source mapping

| This file | Source repo file (xpace-landing-page) |
|---|---|
| `Navbar.jsx` | `src/components/Navbar.tsx` |
| `Hero.jsx` | `src/components/Hero.tsx` |
| `Marquee.jsx` | `src/components/Marquee.tsx` (was inline in Manifesto) |
| `FeatureGrid.jsx` | `src/components/Features.tsx` |
| `Pricing.jsx` | `src/components/Pricing.tsx` |
| `Footer.jsx` | `src/components/Footer.tsx` |

This is a static recreation — Framer Motion reveals are simulated with simple CSS transitions, and the WhatsApp button + Magnetic/Tilt cards are reduced to plain hover transforms.
