# Wurmz Agent Handoff — Complete Context

**Last updated:** 2026-04-11
**Repo:** https://github.com/BIueberryMuff1n/Wurmz
**Stack:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion
**Deploy target:** Railway (NOT Vercel)

---

## What This Is

A single-page scroll-driven landing site for **Wurmz** — a NYS micro-license craft cannabis brand specializing in organic living soil cultivation. The entire experience is one continuous underground journey from sky to soil to worm colony. A worm character guides you through.

## The Brand

- **NYS micro license** — smallest legal canopy, craft not commercial
- **Single source processor** — grows flower, washes hash, presses rosin all in-house
- **Living soil** — no synthetics, no hydroponics. Worms, fungi, microbes do the work
- **CANNOT use the word "organic"** — regulatory restriction. Use "natural inputs" or "living soil"
- **Hand trimmed, small batch, natural inputs**
- **Graffiti/street art aesthetic** matching the logo — thick outlines, crimson + violet + dark earth
- **First drop: 4/20/2026**

## User Persona

**Maya Reyes**, 31, Dominican-Puerto Rican, Bushwick. Environmental justice worker. Skeptical of corporate cannabis and greenwashing. Values transparency and process over branding. Loyal once trust is earned. Wants to know who grew her weed and how. The graffiti aesthetic resonates because it feels like New York, not a focus group.

---

## Architecture Overview

### Scroll-Driven Experience (0→1 progress)

| Progress | Zone | What's Visible |
|----------|------|---------------|
| 0.00-0.12 | Sky | Night sky, stars, moon (real phase), NYC skyline, chemtrails, anime grass at ground line, biplane with worm, "Click to Jump" |
| 0.12-0.25 | Surface/Topsoil | Parachute descent, straw texture, Brand section |
| 0.25-0.45 | Topsoil (FROZEN) | Horizontal Grow scroll (3 cards), perlite speckles, depth frozen |
| 0.45-0.65 | Living Soil | Process steps, root network, mycelium, soil biology details |
| 0.65-0.80 | Deep Earth | Philosophy section, worms beginning to appear, tunnel fading |
| 0.80-1.00 | Colony | 4/20 countdown, email signup, dense worm colony, T-Rex fossil |

### Z-Index Stack (back → front)

```
z-[1]  body::after       — Grunge texture (mix-blend-mode: overlay)
z-[2]  UndergroundJourney — 44-point color spine + texture layers (straw, perlite, roots)
z-[2]  SoilBiology       — Mycelium, nematodes, castings, iron oxide, clay, rock fragments
z-[3]  WormTunnel        — SVG tunnel path + segmented worm character
z-[4]  WormPit           — Canvas worm colony (150 desktop, 40 mobile)
z-[5]  BuriedArtifacts   — RAW pack, bone, lighter, quartz, bedrock (7 curated items)
z-[7]  SurfaceScene      — Sky gradient, stars, moon, skyline, grass, ground fade
z-[8]  ParachuteWorm     — Descending worm after jump
z-[15] PlaneIntro        — Biplane looping in sky
z-[20] main              — ALL content sections
z-[50] body::before      — Fine grain noise
z-[100] DropClock        — Countdown top-left
z-[100] CinematicMode    — Auto-play button bottom-right
```

### Key Files

| File | Purpose |
|------|---------|
| `components/DesignSystem.tsx` | **Single source of truth** for colors, scroll zones, worm spec, z-index, performance budget |
| `components/ScrollContext.tsx` | One scroll progress value (0→1) distributed to all components |
| `components/UndergroundJourney.tsx` | 44-point cubic Hermite color spine + gaussian texture layers |
| `components/WormTunnel.tsx` | SVG tunnel path + 6-segment worm body with face/joint/smoke |
| `components/WormPit.tsx` | Canvas colony — 150 worms with depth compositing |
| `components/SurfaceScene.tsx` | Sky, stars, moon, skyline, grass, ground fade |
| `components/PlaneIntro.tsx` | Biplane with worm character, "Click to Jump" |
| `components/AnimeGrass.tsx` | 120 grass blades with wind gust waves |
| `components/SoilBiology.tsx` | Mycelium, nematodes, castings, iron oxide, clay, rock |
| `components/BuriedArtifacts.tsx` | 7 curated hidden artifacts with scroll Y-offset |
| `components/GraffitiIcons.tsx` | 7 custom SVG icons for Grow cards + Process steps |
| `components/EasterEggs.tsx` | Browser tab title changes, console.log messages |
| `components/CinematicMode.tsx` | Auto-play choreographed scroll |
| `components/DropClock.tsx` | Red sci-fi countdown to 4/20/2026 |

### Key Documentation

| File | Purpose |
|------|---------|
| `docs/DESIGN-RULES.md` | 11 canonical rules — the LAW |
| `docs/LAYER-ARCHITECTURE.md` | Z-index stack with WHY behind each decision |
| `docs/COMPONENT-ARCHITECTURE.md` | Layer audit + mermaid decision tree |
| `docs/WORM-CHARACTER-BIBLE.md` | Full character spec across 5 states |
| `docs/AUDIT-REPORT.md` | Codebase audit against design rules |
| `docs/plans/2026-04-11-mega-plan.md` | Every remaining item with status |
| `docs/personas/eco-community-cannabis-user.md` | User persona: Maya Reyes |

---

## Canonical Design Rules (MUST FOLLOW)

### 1. No Hard Edges
Nothing creates a visible line, boundary, or transition. Test: scroll slowly — if you can point at where X starts/stops, it's broken.

### 2. Warm Browns Only
Earth colors: R ≥ G ≥ B always. NEVER olive, teal, green, blue in the earth. The `isWarmBrown(r,g,b)` function in DesignSystem validates this.

### 3. Content Always Readable
Every section: `bg-deep-earth/95 backdrop-blur-sm` with sewer grate styling (corner bolts, grate lines). z-20 always above effects.

### 4. Worm Consistency
Same gradient `#7A2818 → #C43A3A → #8B2020`, same outline `rgba(40,12,8,0.7)` 2.5px, same face, same RAW joint across ALL states. See `WORM-CHARACTER-BIBLE.md`.

### 5. Performance Budget
- Worms: 150 desktop, 40 mobile
- Segments: 10-14 per worm
- Draw passes: 3 (outline + body + highlight)
- No `Math.random()` in render — use `pseudoRandom(seed)`

### 6. Y-Axis Locked
No vertical parallax. Sky elements stay at Y position, fade with opacity. Scroll controls WHAT you see, not WHERE things are.

### 7. Depth Freeze During Grow
Progress 0.25-0.45: earth color stays frozen at 0.25 value. Worm goes sideways, not deeper.

### 8. Gaussian Everything
All opacity changes use `gaussian(progress, peak, sigma)` or `rampIn(progress, start, full)`. Never `if/else` gates — they create visible "shelves."

### 9. Nothing Freezes
Artifacts use Y-offset tied to scroll so they move as you scroll past. Opacity gates when visible, position MOVES.

### 10. Depth Compositing
Embedded objects need worms BEHIND and IN FRONT. 3-pass rendering in WormPit canvas.

### 11. Every Frame Intriguing
Always something at the viewport edge — a worm disappearing, texture change beginning, hint of next section. Dead space kills curiosity.

---

## Known Issues (as of last session)

### Regressions Needing Attention
1. **SoilBiology component creates visual noise** — mycelium lines, nematode squiggles, perlite dots all visible simultaneously create "confetti" effect. Consider removing SoilBiology entirely OR dramatically reducing its elements. The canonical rule: "if you remove it and nobody notices, it was noise."
2. **Faint purple bleed on right viewport edge** at some scroll positions — `overflow-x: hidden` added but may need further investigation
3. **Sky→soil transition** still has a faint visible band at scroll ~400-500
4. **Deep zone background** reads as near-black despite brightened color values — soil features (iron oxide, clay) are still too subtle
5. **Tunnel strokes** still somewhat prominent in mid-frames despite thinning

### Things That Work Well
- Anime grass with wind gusts at the ground line
- NYC skyline silhouette (full panorama)
- Worm character with face, RAW joint, skateboard
- Horizontal Grow scroll
- 4/20 countdown with drop clock
- Sewer grate card styling
- Easter eggs (tunnel graffiti, buried artifacts, queen worm, golden worm)
- Copy is lean — 60% trimmed, no repetition

---

## Acceptance Criteria for "Done"

1. ☐ Scroll from top to bottom with ZERO visible color seams or bands
2. ☐ Every content section readable over any background
3. ☐ Worm character visible and consistent across all states
4. ☐ Colony worms at bottom are slow, dense, realistic
5. ☐ Performance: 60fps on desktop, 30fps+ on mobile
6. ☐ No hydration warnings in console
7. ☐ Mobile responsive at 375px
8. ☐ All 11 canonical design rules satisfied
9. ☐ Deployed to Railway
10. ☐ "Click to Jump" plane intro works
11. ☐ 4/20 countdown ticks correctly
12. ☐ Email signup form submits successfully

---

## How to Work on This Project

1. **Read `docs/DESIGN-RULES.md` FIRST** — these are non-negotiable
2. **Read `components/DesignSystem.tsx`** — import constants from here, don't hardcode
3. **Read `docs/WORM-CHARACTER-BIBLE.md`** if touching any worm component
4. **Read `docs/LAYER-ARCHITECTURE.md`** if changing z-index or adding layers
5. **Test by scrolling slowly** — if you can see where a transition starts/stops, fix it
6. **Check `docs/AUDIT-REPORT.md`** for known violations
7. **Check `docs/plans/2026-04-11-mega-plan.md`** for remaining items

### Common Mistakes to Avoid
- Using blue/teal/green in earth colors (must be R ≥ G ≥ B)
- Using `Math.random()` in render (causes hydration mismatch)
- Using `if/else` for opacity (creates visible shelves — use gaussian)
- Adding `translateY` parallax (breaks Y-axis lock rule)
- Exceeding worm count budget (150 desktop max)
- Making the worm tunnel get ahead of the worm body
- Hardcoding values instead of importing from DesignSystem
- Adding visual elements without checking if they pass the "remove and nobody notices" test
