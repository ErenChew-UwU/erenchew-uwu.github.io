# Portfolio Design System

This document is the single source of truth for styling and UI decisions in Portfolio. Future components and page changes should reference these rules before adding new visual patterns.

## Brand Identity

Portfolio is a modern, anime/ACG-inspired personal portfolio with a slightly futuristic mood. The experience should feel immersive, glowing, and expressive while remaining clean, readable, and easy to navigate.

### Primary Gradient

| Token | Value | Usage |
|---|---|---|
| `--gradient-primary` | `linear-gradient(135deg, #b95dff 0%, #6331c6 34%, #1b0549 78%)` | Site background, category panels, large brand moments |
| `--color-primary` | `#b95dff` | Primary theme color and gradient start |
| `--color-primary-mid` | `#6331c6` | Gradient bridge and secondary purple |
| `--color-primary-dark` | `#1b0549` | Gradient end, deep backgrounds |

### Accent Color

| Token | Value | Usage |
|---|---|---|
| `--color-accent` | `#ffd36e` | Section labels, small highlights, important metadata |
| `--color-cyan` | `#6de7ff` | Secondary highlight, interactive/tech category accents |
| `--color-pink` | `#ff8dcf` | Illustration and playful visual accents |

## Colors

| Token | Value | Usage |
|---|---|---|
| `--color-night` | `#12002f` | Sticky header, dark overlays |
| `--color-paper` | `#fff8ff` | Primary light buttons, text on dark surfaces |
| `--color-mist` | `#f3e8ff` | Soft pale surface or future light accents |
| `--color-text` | `#fdf7ff` | Main text on dark gradient backgrounds |
| `--color-muted` | `rgba(253, 247, 255, 0.72)` | Body copy and secondary metadata |
| `--color-border` | `rgba(255, 255, 255, 0.18)` | Card, header, and panel borders |
| `--color-border-strong` | `rgba(255, 255, 255, 0.28)` | Hover borders and active nav states |
| `--color-surface` | `rgba(255, 255, 255, 0.10)` | Cards, panels, dropdowns |
| `--color-surface-hover` | `rgba(255, 255, 255, 0.12)` | Nav hover, secondary button hover |
| `--color-shadow` | `rgba(12, 0, 40, 0.34)` | Large floating shadows |
| `--color-shadow-soft` | `rgba(12, 0, 40, 0.18)` | Card shadows |

## Typography

| Token | Value | Usage |
|---|---|---|
| `--font-sans` | `Inter, "Noto Sans SC", "Microsoft YaHei", Arial, sans-serif` | All interface text |
| `--font-size-xs` | `12px` | Tags and small metadata |
| `--font-size-sm` | `13px` | Navigation, buttons, section labels |
| `--font-size-md` | `18px` | Body lede text |
| `--font-size-lg` | `22px` | Card headings |
| `--font-size-section` | `clamp(30px, 5vw, 58px)` | Section titles |
| `--font-size-page` | `clamp(42px, 8vw, 92px)` | Page hero titles |
| `--font-size-hero` | `clamp(48px, 9vw, 118px)` | Homepage hero title |

Rules:

- Use `font-weight: 800-950` for navigation, buttons, labels, and major headings.
- Body copy uses `line-height: 1.75-1.8`.
- Major headings use compact line heights around `0.92-1`.
- Letter spacing stays `0`; avoid compressed display type.
- Do not scale type purely by viewport width outside the established `clamp()` tokens.

## Spacing And Layout

| Token | Value | Usage |
|---|---|---|
| `--radius` | `8px` | Cards, panels, dropdowns, fixed UI containers |
| `--max` | `1180px` | Main content width |
| `--section-space` | `72px 0` | Desktop section spacing |
| `--section-space-mobile` | `54px 0` | Mobile section spacing |
| `--gap-sm` | `8px` | Tags and compact groups |
| `--gap-md` | `18px` | Cards and grids |
| `--gap-lg` | `28px` | Hero actions and section actions |

## Components

### Buttons

- Primary buttons use `--color-paper` background with `--color-primary-dark` text.
- Secondary buttons use translucent white surfaces and `--color-border`.
- Buttons are pill-shaped with `999px` radius, bold text, and at least `38px` height.
- Hover states lift by `translateY(-1px)` and increase surface/border visibility.
- Focus states must use a visible outline with `--color-accent`.

### Cards

- Cards use `--color-surface`, `--color-border`, `--radius`, and soft shadows.
- Do not nest cards inside cards.
- Work cards can include generated gradient art placeholders until real images are available.

### Navigation Bar

- Header is sticky, translucent, blurred, and bordered.
- Main navigation is horizontal on desktop and becomes a controlled mobile panel below `900px`.
- Works navigation owns a dropdown containing all category routes.
- Dropdowns use matching translucent surfaces, border, blur, and subtle slide/fade animation.

### Dropdowns

- Open on hover and keyboard focus on desktop.
- Open via click/tap on mobile.
- Items must be large enough for touch and keyboard navigation.
- Use `opacity`, `transform`, and `visibility` transitions only.

### Inputs

- Inputs should use translucent surfaces, `--color-border`, `--color-text`, and an accent focus ring.
- Placeholder text should use `--color-muted`.

### Modals

- Modals should use a dark translucent overlay, a `--color-surface` panel, `--radius`, and clear focus management.
- Keep motion subtle and avoid large animated entrances.

### Scrollbar

- Track is transparent.
- Thumb uses the primary gradient from `#b95dff` to `#1b0549`.
- Thumb is rounded and minimal.
- Support both Chromium/WebKit and Firefox.

### Animations

- Default transition duration: `180ms`.
- Use `ease` for hover and small UI changes.
- Avoid excessive motion or repeated attention-grabbing effects.

## Design Principles

- Preserve the purple gradient identity and anime/ACG-inspired atmosphere.
- Keep layouts clear and information easy to scan.
- Use glowing accents sparingly for hierarchy, not decoration overload.
- Prefer reusable tokens and component classes over page-specific styling.
- Future categories should reuse the same work grid, category page, tag, and panel patterns.
- Accessibility is part of the visual system: semantic HTML, visible focus states, sufficient contrast, and responsive touch targets are required.
