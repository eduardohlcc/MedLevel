# MedLevel Design System

## 1. Visual Philosophy & Editorial Tone

MedLevel is designed with an understated, professional, and academic editorial aesthetic. Medical students spend long hours preparing for critical board examinations and need an interface optimized for prolonged focus, optical ergonomics, and high readability.

### Core Anti-Patterns (Strictly Prohibited)
- ❌ No bright neon gradients, purple-pink cyber aesthetics, or glassmorphism.
- ❌ No emojis used as icons or interface decoration.
- ❌ No overly rounded bubbles (border radii are restrained between 4px and 6px).
- ❌ No generic marketing landing pages ("Revolucione sua preparação com IA").
- ❌ No placeholder Lorem Ipsum or mocked vanity metrics.

---

## 2. Design Tokens

### Color Palette (CSS Variables & Tailwind)

| Token Name | Light Value | Dark Value | Purpose / Usage |
|---|---|---|---|
| `--background` | `#F6F4EF` (Warm Off-white) | `#141615` (Deep Slate Charcoal) | Main viewport canvas |
| `--surface` | `#FFFFFF` | `#1A1D1C` | Cards, elevated containers |
| `--surface-subtle` | `#EFECE4` | `#232725` | Table headers, secondary surfaces |
| `--foreground` | `#1C1F1D` (Deep Graphite) | `#EBEAE5` | Primary body text |
| `--foreground-muted` | `#606662` | `#9DA3A0` | Captions, metadata, secondary text |
| `--border` | `#D9D5CB` | `#2E3331` | Hairline dividers, subtle card borders |
| `--primary` | `#0F4C4A` (Deep Teal) | `#2A7C79` | Brand identity, primary CTAs |
| `--primary-foreground` | `#FFFFFF` | `#0F1E1E` | Text inside primary buttons |
| `--accent` | `#B4691F` (Burnt Amber) | `#D98A3C` | Sparingly used accents, warnings, bookmarks |
| `--accent-foreground` | `#FFFFFF` | `#1E1205` | Text inside accent elements |
| `--success` | `#2F7D4F` (Forest Green) | `#42A86C` | Correct alternatives, high performance |
| `--destructive` | `#B23A3A` (Muted Crimson) | `#D95353` | Incorrect answers, critical actions |

---

## 3. Typography Hierarchy

| Font Family | Role | Font Weights | CSS Class |
|---|---|---|---|
| **Source Serif 4** | Editorial Headings, Clinical Vignette Stems | 400, 600, 700 | `font-serif` |
| **IBM Plex Sans** | Primary UI, Body Text, Form Labels, Navigation | 400, 500, 600 | `font-sans` |
| **IBM Plex Mono** | Timers, Quantitative Scores, Badges, Metrics | 400, 500 | `font-mono` |

### Typographic Scale
- **Display Heading**: 2.25rem (36px), Line-height: 1.25, `font-serif font-semibold`
- **Page Title (H1)**: 1.875rem (30px), Line-height: 1.3, `font-serif font-semibold`
- **Section Heading (H2)**: 1.5rem (24px), Line-height: 1.35, `font-serif font-medium`
- **Subsection (H3)**: 1.25rem (20px), Line-height: 1.4, `font-sans font-semibold`
- **Body Regular**: 1rem (16px), Line-height: 1.6, `font-sans font-normal`
- **Body Small / Captions**: 0.875rem (14px), Line-height: 1.5, `font-sans text-muted`
- **Metrics / Numbers**: 1.125rem - 2rem, `font-mono font-medium`

---

## 4. Layout & Grid Rules

- **12-Column Grid** with responsive gutters (16px on mobile, 24px on desktop).
- **Spacings strictly on 4px grid** (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **Comfortable Reading Column**: The clinical question vignette must have `max-w-[75ch]` to prevent optical fatigue during multi-hour tests.
- **Border Radius**: Restrained to `4px` (`rounded-sm` or `rounded`) to `6px` (`rounded-md`).
- **Borders over Shadows**: Clean 1px solid borders (`border border-border`) replace heavy dropshadows.
- **Icons**: Single icon library **Lucide React** with unified stroke width (`strokeWidth={1.75}`) and standard sizes (`16px`, `18px`, `20px`).
- **Microinteractions**: Subtle transitions (`transition-all duration-150 ease-out`), with strict adherence to `@media (prefers-reduced-motion: reduce)`.

---

## 5. Development Gallery (`/design`)

An internal page accessible at `/design` in development mode previews all design tokens, font hierarchy, interactive buttons, form elements, badges, alerts, and question option card states.
