# Wurmz Landing Page Design — "The Underground"

**Date:** 2026-04-10
**Status:** Approved

## Overview

Wurmz is a craft cannabis brand specializing in organic living soil cultivation. The website is a single-page landing experience that educates visitors on the brand and grow practices, announces drops, and collects email signups. Wurmz products are carried in dispensaries — this is a brand site, not a storefront.

## Aesthetic Direction

"The Underground" meets "The Label" — immersive dark soil atmosphere with structured, centered layout. The page feels like descending underground: dark, warm, organic. Neon pink/purple accents glow like bioluminescence. Animations are slow and organic (roots growing, not UI spinning).

## Tech Stack

- **Framework:** Next.js (React)
- **Deployment:** Vercel
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion (scroll-triggered reveals)
- **Email:** API route (wire to Mailchimp/Resend/etc later)
- **Fonts:** Google Fonts

## Color Palette

| Role             | Hex       | Usage                                    |
| ---------------- | --------- | ---------------------------------------- |
| Soil Black       | `#110D08` | Page background                          |
| Deep Earth       | `#1E1710` | Card backgrounds, subtle depth           |
| Root Brown       | `#3D2B1F` | Borders, secondary elements              |
| Crimson Neon     | `#E63462` | Primary accent — CTAs, glows, highlights |
| Violet Pulse     | `#8B5CF6` | Secondary accent — hover, decorative     |
| Mycelium White   | `#F5F0E8` | Body text — warm off-white               |
| Iridescent       | pink→violet gradient | Tagline text, special moments  |

## Typography

- **Display/Headers:** Dela Gothic One or Rubik Dirt (bold, gritty, organic character)
- **Body:** Space Mono or IBM Plex Mono (underground/technical grow-operation feel)

## Page Sections

### 1. Hero (full viewport)
- Wurmz logo (existing PNG) centered with bioluminescent glow ring (slow CSS pulse)
- Rotating tagline — crossfade every 4s ("Organic Living Soil" + future taglines)
- Subtle down-arrow scroll indicator with gentle bounce
- Background: soil texture with grain overlay, faint root SVGs drifting at viewport edges

### 2. The Brand
- Large bold headline, 2-3 sentences of brand story
- Pull-quote style — big text, generous whitespace
- Dark card with root-brown border

### 3. The Grow (education)
Three cards (side-by-side desktop, stacked mobile):
- **Living Soil** — what it is
- **The Microbiome** — worms, fungi, bacteria working together
- **No Synthetics** — what Wurmz doesn't use and why

Cards: Deep Earth background, Crimson Neon top border accent, earthy icon placeholders.

### 4. Drops & Stockists
- **4/20 Countdown Timer** — animated countdown to April 20, 2026 (first drop). Large, bold numerals in iridescent gradient. Days / Hours / Minutes / Seconds. Crimson neon glow. This is the hype centerpiece.
- After 4/20: transitions to drop cards (strain name, date, which shops) + stockist list
- Designed to evolve as the business grows

### 5. Stay Underground (email signup)
- Bold CTA headline
- Single email input + neon pink submit button
- Input: soil-dark background, root-brown border, crimson glow on focus

### 6. Footer
- Social icon links (Instagram, etc.)
- Small legal text
- Root Brown divider line

## Animations

- **Hero:** Logo fade-in with scale-up, pulsing glow ring, drifting root SVGs
- **Scroll reveals:** Each section fades up on scroll (Framer Motion whileInView), organic easing
- **Tagline:** Crossfade rotation every 4 seconds
- **Background:** CSS grain/noise overlay, CSS keyframe floating particles (no canvas)
- **CTA button:** Neon glow intensifies on hover
- **Overall:** Slow, organic motion throughout — nothing snappy or mechanical

## Brand Context

- Logo: circular badge with graffiti-style "WURMZ" lettering, tree roots, worms, dark earth tones with pink/red and purple accents
- Theme: "Organic Living Soil" — the worm ecosystem, craft cultivation, no synthetics
- Products carried in dispensaries (brand site, not a storefront)
- Rotating taglines planned (starting with "Organic Living Soil")
