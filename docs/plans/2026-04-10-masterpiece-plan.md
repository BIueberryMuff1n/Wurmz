# Wurmz — The Masterpiece Plan

## The Vision

You're not scrolling a website. You're descending into the earth.

The entire experience is one continuous, cinematic journey from sky to soil to the living underground. A worm — your guide — parachutes in from the night sky, hits the ground, and starts digging. You follow it down through layers of earth that get richer, darker, and more alive the deeper you go. The worm disappears and reappears. It moves sideways. It smokes a joint. At the very bottom, you reach the colony — hundreds of worms writhing in rich living soil, the heartbeat of everything Wurmz stands for.

Every scroll position tells part of this story. Nothing is static. Nothing is decorative. Everything serves the narrative.

---

## The Architecture: 7 Acts

### Act 1: The Arrival (0-10% scroll)
**Night sky. Stars. Moon. Stillness.**

A tiny worm with a parachute descends from above. It starts as a speck and grows as it approaches the ground. The Wurmz logo sits centered — glowing, pulsing. The tagline rotates beneath it. This is the hook.

**Key detail:** The sky isn't just a gradient — it has depth. Parallax stars, a warm moon, and the faintest suggestion of soil at the bottom edge. The parachute worm sways gently. As it approaches the ground, the parachute collapses.

### Act 2: Breaking Ground (10-20% scroll)
**The worm hits soil. The dig begins.**

The surface scene fades. The background shifts from sky tones to the first soil layer — a warm, mulchy brown with straw-fiber texture. The worm (now the tunnel worm) begins carving downward. The tunnel appears directly behind it — the interior matches the soil layer it's passing through.

**Key detail:** The transition from sky to soil is seamless. No hard lines. The soil "rises" from the bottom of the viewport as you scroll, like the camera is pushing into the earth.

### Act 3: The Brand Story (20-35% scroll)
**Light soil zone. Perlite speckles. Roots beginning to appear.**

The worm curves off-screen to the left — your eye falls on the Brand section. The copy tells you who Wurmz is. The soil gets slightly warmer, with visible white perlite chunks scattered in the background. Faint root lines begin to emerge.

**Key detail:** When the worm exits the viewport, it leaves behind its tunnel trail. The tunnel interior shows the same perlite-speckled soil as the surrounding background. The Brand card has a graffiti-style treatment — thick border, offset shadow, rough edges.

### Act 4: The Grow — Horizontal Journey (35-55% scroll)
**This is the showpiece section.**

Vertical scrolling maps to horizontal movement. The worm travels left-to-right in the background, burrowing sideways through the soil. Three cards scroll by as the worm passes: Living Soil, Single Source, Small Batch. The worm is visible behind the cards, moving with you.

**Key detail:** The soil layer here is rich and dark — the "living soil" zone. Subtle root networks are visible in the background. The horizontal scroll feels effortless — controlled by vertical scrolling, not a separate gesture. A small "scroll" hint appears initially and fades.

### Act 5: The Process (55-70% scroll)
**Deep soil. Darker. Denser.**

The worm returns from the right side, curves back to center, and continues downward. The Process section reveals: Grow → Harvest → Wash → Press. Each step staggers in from alternating sides. The soil is now distinctly darker. Faint worm shapes begin to appear in the background — you're approaching the colony.

**Key detail:** The first background worms appear here — just 2-3, small and distant. They're a preview of what's coming. The tunnel worm's joint smoke drifts up lazily.

### Act 6: The Drop (70-85% scroll)
**Deep underground. The countdown.**

4/20 countdown timer sits in near-darkness, numbers glowing with iridescent shimmer. The worm curves off-screen one more time. Background worms are now more frequent — maybe 15-20 visible, slowly wriggling. The soil is almost black.

**Key detail:** The countdown numbers have a crimson text-shadow glow that pulses subtly. "Stay Underground" email signup sits below, its input field glowing crimson on focus. This is the conversion point.

### Act 7: The Colony (85-100% scroll)
**Macro view. The worm pit.**

The entire background becomes a living, breathing mass of worms. Hundreds of them, rendered on canvas, with realistic propagating body-wave locomotion. They're denser at the bottom, bigger as you approach (macro zoom feel). The worm tunnel ends here — your guide worm joins the colony.

**Key detail:** The worms at the very bottom are LARGE — you're seeing them up close. Their bodies have segment detail, color variation, and smooth sinusoidal movement. The footer sits over this living background. It should feel like looking through a glass terrarium wall at a thriving worm bin.

---

## Technical Execution Plan

### Phase 1: Foundation Reset
**Goal: Clean, unified scroll system with no desync issues.**

1. **Unified scroll controller** — One component that calculates scroll progress and distributes it to all other components via React context. No more each component doing its own `window.addEventListener("scroll")`. This fixes the tunnel/worm desync permanently.

2. **Fix logo** — Use CSS `clip-path: circle()` on the Image element instead of trying to crop the PNG. This guarantees a perfect circle regardless of source image.

3. **Remove unused components** — Delete AuraEffect, FloatingParticles, RootTendrils, MyceliumNetwork, WormCursor, OrganicDivider (files still exist but aren't imported).

### Phase 2: The Journey Engine
**Goal: Seamless soil layer transitions driven by one scroll value.**

4. **Soil layer system** — Rewrite UndergroundJourney as a proper layer compositor. Each layer (sky, straw, perlite, living soil, deep earth) has opacity curves that cross-fade smoothly. No hard edges anywhere. The background color interpolates through 10+ stops.

5. **Tunnel soil matching** — The tunnel interior dynamically matches the surrounding soil. At the top it's lighter with perlite texture. In the middle it's rich dark brown. At the bottom it's near-black. This is a single `linearGradient` keyed to the SVG's vertical axis.

6. **Worm visibility gating** — Parachute worm: visible 0-12%. Tunnel worm: visible 12-85%. Neither visible at the same time. WormPit: fades in starting at 60%.

### Phase 3: The Horizontal Grow Section
**Goal: Scroll-jacking that feels native, with worm companion.**

7. **Sticky horizontal scroll** — The Grow section is 200vh tall with a sticky inner container. Vertical scroll maps 1:1 to horizontal scroll. Cards slide left as you scroll down. The section "releases" you back to vertical after all cards pass.

8. **Background worm** — A dedicated worm (matching the tunnel worm's style) moves left-to-right behind the cards, keeping pace with the horizontal scroll progress.

### Phase 4: The Worm Pit Climax
**Goal: Dense, realistic, mesmerizing worm colony.**

9. **Canvas worm simulation** — Realistic body-wave locomotion (sine wave propagating along segments with phase delay). Bottom-heavy distribution. Size increases with depth (macro zoom). Color variation in brownish-reds.

10. **Density gradient** — Top of viewport: 0-5 worms. Middle: 20-30. Bottom 40%: 200+. It should feel like descending into a worm bin.

### Phase 5: Graffiti Polish
**Goal: Every element feels hand-drawn and raw.**

11. **Grunge texture overlays** — Heavy grain, concrete roughness, splatter speckle. Applied globally.

12. **Card styling** — All cards/sections have: thick dark outlines (3-4px), flat offset shadows, crimson accent borders. No rounded corners — squared or rough.

13. **Typography treatment** — Rubik Dirt headers get subtle text-shadow for depth. Body text stays clean mono for readability contrast.

14. **Worm character** — The tunnel worm has personality: side-profile face, droopy stoned eye, cone-shaped joint tilted upward, smoke puffs rising. This is the brand mascot.

### Phase 6: Ship
**Goal: Live on Railway.**

15. **Performance audit** — Canvas worms must maintain 60fps. Reduce count on mobile. Lazy-load below-fold sections. All animations use GPU-composited properties.

16. **Mobile responsive** — Every section works at 375px. Horizontal scroll section becomes vertical on mobile. Worm pit reduces density.

17. **Deploy to Railway** — Configure for Next.js, push, verify.

---

## What Makes This a Masterpiece

- **Narrative-driven** — Every scroll position advances a story
- **One continuous environment** — Not sections on a page, but layers of earth
- **A character guide** — The worm isn't decoration, it's your companion
- **Sensory climax** — The worm pit at the bottom is genuinely mesmerizing
- **Brand-authentic** — The whole experience IS what Wurmz is about: what's under the surface
