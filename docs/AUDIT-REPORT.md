# Wurmz Design System Audit Report

**Date:** 2026-04-10
**Audited against:** `components/DesignSystem.tsx` and `docs/DESIGN-RULES.md`

---

## Legend

- **PASS** — No violations found for this rule
- **FAIL** — Violation(s) found; line numbers and fixes listed

---

## 1. components/UndergroundJourney.tsx

### 1.1 Colors (warm browns, R >= G >= B)
**PASS** — All COLOR_STOPS entries have R >= G >= B. Verified all 40+ control points. No olive/green/blue leakage.

### 1.2 Z-index
**PASS** — Line 137: `z-[2]` matches `Z.earth = 2`.

### 1.3 Fixed overlays
**FAIL** — Line 137: Uses `fixed inset-0` for the earth background. Per Rule 10, background effects should move with the page to maintain depth illusion. However, this component is a continuous color field (not a particle/worm layer), so the fixed approach may be intentional since the color is derived from scroll progress. **Borderline** — verify the earth color field is not perceived as a static wallpaper.

### 1.4 Hard edges (if/else opacity gates)
**PASS** — Uses `gaussian()` and `rampIn()` with hermite smoothstep throughout (lines 96-106, 131-134). No binary opacity gates.

### 1.5 Worm consistency
**N/A** — No worm rendering in this component.

### 1.6 Performance
**PASS** — SVG element counts are static and reasonable (50 straw fibers, 120 perlite speckles, 20 chunks, 40 soil particles, 15 myc dots). No worms.

---

## 2. components/SurfaceScene.tsx

### 2.1 Colors
**FAIL** — Line 83-93: Night sky gradient uses hardcoded blue/purple hex values:
- `#0a0f1a` (R=10, G=15, B=26 — G > R AND B > R)
- `#111827` (R=17, G=24, B=39 — G > R AND B > R)
- `#1a1f3a` (R=26, G=31, B=58 — G > R AND B > R)
- `#2d1f3d` (R=45, G=31, B=61 — B > R)
- `#241a30` (R=36, G=26, B=48 — B > R)
- `#161622` (R=22, G=22, B=34 — B > R)
- `#10131e` (R=16, G=19, B=30 — G > R AND B > R)

**Note:** These are the sky colors and `DESIGN-RULES.md` Rule 5 explicitly states "Sky: dark blue-black `rgb(10,15,26)`" as an allowed exception. The sky is *supposed* to be blue-black. **PASS (exception)** — sky colors are intentionally blue per the design rules.

- Line 316: `fill="rgba(140,145,165,0.85)"` for NYC skyline silhouette — G=145 > R=140, B=165 > R=140. This is gray-blue, not a warm brown, but it is a skyline silhouette in the sky zone.
**Minor** — Consider making the skyline fill warmer, e.g., `rgba(145,140,135,0.85)` to satisfy R >= G >= B.

- Line 161: Cockpit area `rgba(40,60,80,0.1)` — G=60 > R=40, B=80 > R=40 (blue tint).
**FIX:** This is in PlaneIntro.tsx, not here. Noted under PlaneIntro below.

### 2.2 Z-index
**PASS** — Line 75: `z-[7]` matches `Z.surfaceScene = 7`.

### 2.3 Fixed overlays
**FAIL** — Line 75: Uses `absolute` positioning with `top-0`, height `100vh`. This is correct — it scrolls with the page via opacity fade. **PASS** on review.

### 2.4 Hard edges
**PASS** — `skyFade` and `groundFade` use continuous `Math.max(0, 1 - scrollY / N)` linear ramps. No if/else opacity gates.

### 2.5 Worm consistency
**N/A** — No worm rendering.

### 2.6 Performance
**PASS** — Stars: 16 desktop / 8 mobile (line 119) matches Rule 7 spec exactly.

---

## 3. components/WormTunnel.tsx

### 3.1 Colors
**PASS** — Worm gradient (lines 113-118): `#7A2818 -> #C43A3A -> #8B2020` matches `WORM.gradient` exactly. Tunnel colors are warm browns.

### 3.2 Z-index
**PASS** — Line 88: `z-[3]` matches `Z.wormTunnel = 3`.

### 3.3 Fixed overlays
**PASS** — Line 88: Uses `absolute inset-0` with `height: pageHeight`. Correctly sized to full document height, not fixed.

### 3.4 Hard edges
**FAIL** — Line 70-72: Fade-out uses a hard if/else gate:
```
const fadeOpacity = adjustedProgress > 0.75
  ? Math.max(0, 1 - (adjustedProgress - 0.75) / 0.15)
  : 1;
```
This creates a hard edge at `adjustedProgress = 0.75` where opacity snaps from 1.0 to beginning of a linear ramp. Should use a gaussian or smoothstep curve instead.

**FIX:** Replace with `gaussian(adjustedProgress, 0.45, 0.25)` or a hermite-based ramp that starts fading earlier with a smooth onset.

### 3.5 Worm consistency
**PASS** — Gradient matches canonical `#7A2818 -> #C43A3A -> #8B2020` (lines 113-118). Outline `rgba(40,12,8,0.7)` matches `WORM.outline.color`. Segment lines `rgba(60,15,10,0.2)` match `WORM.segments.color`. Eye fill `#1a0a05` matches `WORM.eye.fill`. Eyelid `rgba(140,35,25,0.7)` close to `WORM.eyelid` (`rgba(140,35,25,0.6)`) — slightly different opacity.

**Minor** — Line 512: Eyelid opacity 0.7 vs DesignSystem 0.6. Line 194 uses 0.5.
**FIX:** Standardize all eyelid fills to `rgba(140,35,25,0.6)` per `WORM.eyelid`.

### 3.6 Performance
**PASS** — Single worm with 6 segments. Well within budget.

---

## 4. components/WormPit.tsx

### 4.1 Colors
**PASS** — Worm colors are generated as `{r: 120-200, g: 35-65, b: 30-55}` (lines 244-247), always R > G > B. Golden worm `{218, 165, 32}` also R > G > B. No blue/green/olive.

### 4.2 Z-index
**PASS** — Line 213: `z-[4]` matches `Z.wormColony = 4`.

### 4.3 Fixed overlays
**FAIL** — Line 213: Canvas uses `fixed inset-0`. Per Rule 10 and DESIGN-RULES.md, the worm pit should translate the drawing context by scroll offset so worms appear at fixed page coordinates. The code at line 89 has a comment "Living background -- worms fill the viewport, no scroll offset" and does NOT apply `ctx.translate(0, -scrollOffset)`.

**FIX:** Add scroll offset translation as specified in DESIGN-RULES.md Rule 10: `ctx.translate(0, -scrollOffset)` so worms feel like they exist at fixed positions in the soil column rather than being a wallpaper stuck to the viewport.

### 4.4 Hard edges
**FAIL** — Lines 128-134: Density fraction uses chained if/else with hard breakpoints:
```
const densityFraction = p < 0.55
  ? 0.02
  : p < 0.70
    ? 0.02 + ((p - 0.55) / 0.15) * 0.08
    : p < 0.85
      ? 0.10 + ((p - 0.70) / 0.15) * 0.40
      : Math.min(1, 0.50 + ((p - 0.85) / 0.15) * 0.50);
```
Creates visible "shelves" at 0.55, 0.70, and 0.85. Should be a single smooth curve (e.g., sigmoid or hermite ramp).

**FIX:** Replace with `rampIn(p, 0.50, 0.95)` or a smooth sigmoid curve from the DesignSystem.

**FAIL** — Lines 206-208: Pit opacity also uses chained if/else:
```
const pitOpacity = progress < 0.70
  ? Math.max(0, (progress - 0.45) / 0.25) * 0.15
  : Math.min(0.85, 0.15 + ((progress - 0.70) / 0.30) * 0.70);
```
Hard breakpoint at 0.70.

**FIX:** Use a single smooth hermite or sigmoid ramp.

### 4.5 Worm consistency
**FAIL** — Colony worms do NOT use the canonical gradient `#7A2818 -> #C43A3A -> #8B2020`. Instead, each worm gets a random brownish-red color (lines 244-247) and is drawn as flat solid strokes (lines 375, 359). The DesignSystem specifies a consistent gradient across all worm renders.

**FIX:** Either apply a canvas gradient matching `WORM.gradient` to each worm's stroke, or at minimum ensure the color range clusters around the canonical gradient values. The current random color approach means some worms may look significantly different from the tunnel/parachute/plane worms.

### 4.6 Performance
**PASS** — Line 73: `isMobile ? 40 : 150` exactly matches `PERFORMANCE.worms.desktop = 150` and `PERFORMANCE.worms.mobile = 40`. Segment count 12-20 (line 223) is slightly above `PERFORMANCE.worms.segmentsPerWorm.max = 14`.

**FAIL** — Line 223: `segCount = 12 + Math.floor(pseudoRandom(seed * 7) * 8)` produces 12-19 segments. Max allowed is 14.
**FIX:** Change to `8 + Math.floor(pseudoRandom(seed * 7) * 7)` to produce 8-14 segments per `PERFORMANCE.worms.segmentsPerWorm`.

**FAIL** — Draw passes: The code performs 3 draw passes per worm (outline stroke, body stroke, highlight stroke at lines 350-394) plus optional segment rings (line 397). DesignSystem specifies `PERFORMANCE.worms.drawPasses = 2` (outline + body only).
**FIX:** Remove the highlight stroke pass (lines 381-394) and segment ring pass (lines 396-412), or merge highlight into the body pass.

### 4.7 Additional
**FAIL** — Line 286: `Math.random()` used in render-adjacent code (`updateWorm` called from animation loop). Lines 286-287 use `Math.random()` for turn rate and timer. Rule 9 says "No `Math.random()` in render." While this is in an animation callback rather than React render, it can cause non-deterministic behavior.
**FIX:** Use `pseudoRandom()` with a seed derived from worm index + frame count.

---

## 5. components/BuriedArtifacts.tsx

### 5.1 Colors
**FAIL** — Line 311: `groundwater` artifact uses blue-tinted colors:
- `rgba(40,60,90,0.12)` — G=60 > R=40, B=90 > R=40
- `rgba(60,90,130,0.1)` — G=90 > R=60, B=130 > R=60
- `rgba(80,120,170,0.08)` — G=120 > R=80, B=170 > R=80

**Note:** This represents groundwater, which is intentionally blue. However, this artifact type is defined but NOT in the active `artifacts` array (line 8-28), so it is never rendered. **Non-issue currently**, but the dead code contains violations.

- Line 253: `quartz-cluster` uses cool blue-tinted fills:
  - `rgba(220,225,240,0.4)` — G=225 > R=220, B=240 > R=220
  - `rgba(210,220,235,0.35)` — G=220 > R=210, B=235 > R=210
  - Similar for all quartz fills and strokes.

**Note:** Quartz IS in the active artifacts array (line 24). These blue-white crystal colors violate R >= G >= B.
**FIX:** Warm up the quartz crystals, e.g., `rgba(240,225,210,0.4)` to keep them feeling mineral/stone while maintaining R >= G >= B.

### 5.2 Z-index
**PASS** — Line 39: `z-[5]` matches `Z.buriedArtifacts = 5`.

### 5.3 Fixed overlays
**FAIL** — Line 39: Uses `fixed inset-0`. Artifacts are background visual effects that should move with the page per Rule 10. The `scrollDelta` calculation (line 48) provides some relative motion, but the container itself is fixed to the viewport.

**FIX:** Change to `absolute` positioning within the document flow, or apply scroll-offset translation so artifacts feel anchored to specific soil depths.

### 5.4 Hard edges
**PASS** — Uses `gaussian()` for all artifact opacity (line 43). Smooth curves, no if/else gates.

### 5.5 Worm consistency
**N/A** — No worm rendering.

### 5.6 Performance
**PASS** — Only 6 active artifacts with simple SVGs.

---

## 6. components/SoilBiology.tsx

### 6.1 Colors
**FAIL** — Line 182: Water table gradient uses `rgba(40,60,90,0.3)` where G=60 > R=40 and B=90 > R=40. This is a blue tint for the water table hint at very bottom of the scroll.

**Note:** This is at opacity 0.06 max and represents actual water. Borderline acceptable, but technically violates R >= G >= B.
**FIX:** Consider using a cooler brown instead, e.g., `rgba(50,45,60,0.3)` to hint at moisture without going blue.

### 6.2 Z-index
**PASS** — Line 30: `z-[2]` matches `Z.soilBiology = 2`.

### 6.3 Fixed overlays
**FAIL** — Line 30: Uses `fixed inset-0`. Soil biology elements (mycelium, nematodes, mushrooms) are background effects that should appear at specific soil depths. Being fixed means they stay on screen like wallpaper rather than scrolling with the soil.

**FIX:** Either change to absolute positioning within document flow, or translate the SVG viewBox based on scroll progress to simulate depth-locked positioning.

### 6.4 Hard edges
**PASS** — All opacity values use `gaussian()` and `rampIn()` with smoothstep (lines 22-27). No binary gates.

### 6.5 Worm consistency
**N/A** — No worm rendering.

### 6.6 Performance
**PASS** — Small static SVG element counts. Nematode animations use `<animateTransform>` (GPU-friendly).

---

## 7. components/PlaneIntro.tsx

### 7.1 Colors
**FAIL** — Line 161: Cockpit fill `rgba(40,60,80,0.1)` — G=60 > R=40, B=80 > R=40. Blue-tinted glass.
**FIX:** Use a warm tint: `rgba(60,45,35,0.1)`.

### 7.2 Z-index
**PASS** — Line 70: `z-[15]` matches `Z.planeIntro = 15`.

### 7.3 Fixed overlays
**PASS** — Line 70: Uses `fixed inset-0` but this is the plane scene overlay which is interactive UI (click to jump). It fades out with scroll. Acceptable for a UI overlay.

### 7.4 Hard edges
**PASS** — `planeFadeOut` uses continuous `Math.max(0, 1 - scrollY / 500)`. Smooth ramp.

### 7.5 Worm consistency
**PASS** — Lines 168-173: Worm gradient `#7A2818 -> #C43A3A -> #8B2020` matches canonical spec exactly. Outline, eye, eyelid all match.

**Minor** — Line 194: Eyelid `rgba(140,35,25,0.5)` differs from canonical `rgba(140,35,25,0.6)`.
**FIX:** Change to `rgba(140,35,25,0.6)`.

### 7.6 Performance
**PASS** — Single worm instance with simple SVG.

---

## 8. components/ParachuteWorm.tsx

### 8.1 Colors
**FAIL** — Lines 73-75: Backpack uses green colors:
- `fill="#4A5A30"` — R=74, G=90, B=48 — G > R (olive green)
- `stroke="rgba(30,40,15,0.7)"` — G=40 > R=30 (green)
- `fill="#556B35"` — R=85, G=107, B=53 — G > R (army green)

Lines 162-165: Abandoned gear backpack also uses same green colors.

**FIX:** Change backpack to warm browns matching the palette. E.g., `fill="#5A4A30"` (R=90, G=74, B=48), `fill="#6B5535"` (R=107, G=85, B=53). Backpack should be earth-toned, not army-surplus green.

### 8.2 Z-index
**FAIL** — Line 27: `z-[14]` — Not defined in Z constants. Closest would be between `Z.planeIntro = 15` and `Z.surfaceScene = 7`. The parachute worm should be at `Z.parachuteWorm = 8`.
- Line 147: `z-[7]` for abandoned gear — matches `Z.surfaceScene = 7`, which may cause z-fighting.

**FIX:** Line 27: Change `z-[14]` to `z-[8]` to match `Z.parachuteWorm = 8`. Line 147: Change to a value that doesn't conflict (e.g., `z-[6]` or define a specific constant for abandoned gear).

### 8.3 Fixed overlays
**PASS** — Lines 27, 147: Uses `fixed` positioning but the parachute worm is a viewport-relative UI animation element that represents the descent. This is appropriate — it's an interactive scene element, not a background texture.

### 8.4 Hard edges
**FAIL** — Line 20: `wormOpacity` uses a hard if/else gate:
```
const wormOpacity = progress >= 0.85 ? Math.max(0, 1 - (progress - 0.85) / 0.15) : 1;
```
Creates a hard edge at progress = 0.85.

**FIX:** Use `1 - rampIn(progress, 0.80, 1.0)` or a gaussian fade for smooth transition.

### 8.5 Worm consistency
**PASS** — Lines 64-68: Gradient `#7A2818 -> #C43A3A -> #8B2020` matches canonical spec. Outline, eye, segments all match.

**Minor** — Line 93: Eyelid `rgba(140,35,25,0.6)` matches canonical value exactly. Good.

### 8.6 Performance
**PASS** — Single worm with simple SVG elements.

---

## 9. components/Hero.tsx

### 9.1 Colors
**PASS** — No hardcoded earth/soil colors. Uses brand colors via Tailwind classes.

### 9.2 Z-index
**PASS** — No z-index specified (inherits from content flow, which is z-20 via parent).

### 9.3 Fixed overlays
**PASS** — No fixed positioning.

### 9.4 Hard edges
**PASS** — Uses Framer Motion animations with easeOut curves.

### 9.5 Worm consistency
**N/A** — No worm rendering.

### 9.6 Performance
**PASS** — Minimal DOM elements.

---

## 10. components/BrandSection.tsx

### 10.1 Colors
**PASS** — Uses Tailwind design tokens (`bg-deep-earth`, `text-crimson-neon`, `text-mycelium`, `bg-root-brown`). No hardcoded violating colors.

### 10.2 Z-index
**PASS** — No explicit z-index (content sections rely on document flow at z-20).

### 10.3 Fixed overlays
**PASS** — No fixed positioning.

### 10.4 Hard edges
**PASS** — Framer Motion spring animation.

### 10.5 Worm consistency
**N/A** — No worm rendering.

### 10.6 Performance
**PASS** — Static content section.

---

## 11. components/GrowSection.tsx

### 11.1 Colors
**PASS** — Worm gradient (lines 119-123) matches canonical `#7A2818 -> #C43A3A -> #8B2020`.

### 11.2 Z-index
**PASS** — Background worm uses `z-0` (line 109), card track uses `z-10` (line 160). These are local stacking within the section, not global z-index values.

### 11.3 Fixed overlays
**PASS** — Uses `sticky top-0` for the horizontal scroll container. This is a standard horizontal scroll pattern, not a fixed overlay.

### 11.4 Hard edges
**PASS** — `hintOpacity` uses linear ramp `Math.max(0, 1 - progress * 5)`. Continuous.

### 11.5 Worm consistency
**PASS** — Gradient matches. Eye, eyelid, joint all match canonical values. Joint cherry uses correct `#D4641A`, `#F0A030`, `#FFD080`.

### 11.6 Performance
**PASS** — Single decorative worm SVG.

---

## 12. components/GrowCard.tsx

### 12.1 Colors
**PASS** — Uses Tailwind tokens only.

### 12.2 Z-index
**PASS** — No z-index.

### 12.3 Fixed overlays
**PASS** — No fixed positioning.

### 12.4 Hard edges
**PASS** — Framer Motion animation.

### 12.5 Worm consistency
**N/A**.

### 12.6 Performance
**PASS**.

---

## 13. components/CountdownSection.tsx

### 13.1-13.6
**PASS** on all rules. Uses design tokens, standard card styling with corner bolts and grate lines. No worms, no fixed overlays, no hardcoded violating colors.

---

## 14. components/SignupSection.tsx

### 14.1-14.6
**PASS** on all rules. Uses design tokens and standard card patterns. No worms, no fixed overlays.

---

## 15. components/ProcessSection.tsx

### 15.1 Colors
**PASS** — Uses Tailwind tokens only.

### 15.2-15.6
**PASS** on all rules.

**Minor** — Line 37: Uses `bg-deep-earth/90` and `backdrop-blur-sm` but no `CARD_STYLE` border/shadow from DesignSystem. This is the only content section without the sewer-grate border treatment.
**FIX:** Add `style={CARD_STYLE}` or equivalent inline styles for consistency with BrandSection/CountdownSection/SignupSection.

---

## 16. components/PhilosophySection.tsx

### 16.1 Colors
**PASS** — Uses Tailwind tokens only.

### 16.2-16.6
**PASS** on all rules.

**Minor** — Same as ProcessSection: no `CARD_STYLE` border/shadow. Should add for visual consistency.

---

## 17. app/globals.css

### 17.1 Colors
**PASS** — CSS variables use correct palette values matching `BRAND_COLORS` in DesignSystem.

### 17.2 Z-index
**FAIL** — Line 39: `body::after` (grunge texture) uses `z-index: 1` which matches `Z.grungeTexture = 1`. **PASS**.
- Line 56: `body::before` (grain overlay) uses `z-index: 50` which matches `Z.grainOverlay = 50`. **PASS**.

### 17.3 Fixed overlays
**PASS** — `body::after` and `body::before` are fixed texture overlays with `pointer-events: none`. These are full-screen grain/grunge effects that are meant to be viewport-locked (they're visual filters, not depth elements).

### 17.4 Hard edges
**PASS** — Animations use smooth easing curves and gradual transitions.

### 17.5 Worm consistency
**N/A**.

### 17.6 Performance
**PASS** — All animations use `transform` and `opacity` only (GPU-composited properties), per Rule 9.

---

## Summary of Violations

| # | File | Rule | Severity | Line(s) | Issue |
|---|------|------|----------|---------|-------|
| 1 | SurfaceScene.tsx | Colors | Minor | 316 | NYC skyline fill has G > R (gray-blue) |
| 2 | WormTunnel.tsx | Hard edges | Medium | 70-72 | if/else opacity gate at 0.75 threshold |
| 3 | WormTunnel.tsx | Worm consistency | Minor | 512 | Eyelid opacity 0.7 vs canonical 0.6 |
| 4 | WormPit.tsx | Fixed overlays | High | 213 | No scroll offset translation on canvas (Rule 10) |
| 5 | WormPit.tsx | Hard edges | High | 128-134 | Chained if/else density gates at 0.55/0.70/0.85 |
| 6 | WormPit.tsx | Hard edges | Medium | 206-208 | if/else opacity gate at 0.70 |
| 7 | WormPit.tsx | Worm consistency | Medium | 244-247 | Colony worms use random flat colors, not canonical gradient |
| 8 | WormPit.tsx | Performance | Medium | 223 | Segment count 12-19 exceeds max 14 |
| 9 | WormPit.tsx | Performance | Medium | 350-394 | 3+ draw passes per worm, budget is 2 |
| 10 | WormPit.tsx | Performance | Low | 286-287 | Math.random() in animation loop |
| 11 | BuriedArtifacts.tsx | Colors | Medium | 252-263 | Quartz crystal uses blue-tinted fills (G > R, B > R) |
| 12 | BuriedArtifacts.tsx | Fixed overlays | Medium | 39 | Fixed overlay for depth-anchored artifacts |
| 13 | SoilBiology.tsx | Colors | Low | 182 | Water table uses blue tint (G > R, B > R) |
| 14 | SoilBiology.tsx | Fixed overlays | Medium | 30 | Fixed overlay for depth-specific biology |
| 15 | PlaneIntro.tsx | Colors | Low | 161 | Cockpit fill has blue tint (G > R, B > R) |
| 16 | PlaneIntro.tsx | Worm consistency | Minor | 194 | Eyelid opacity 0.5 vs canonical 0.6 |
| 17 | ParachuteWorm.tsx | Colors | High | 73-75, 162-165 | Backpack uses olive/army green (G > R) |
| 18 | ParachuteWorm.tsx | Z-index | Medium | 27 | z-[14] not in Z constants; should be z-[8] |
| 19 | ParachuteWorm.tsx | Hard edges | Medium | 20 | if/else opacity gate at 0.85 |
| 20 | ProcessSection.tsx | Consistency | Minor | 37 | Missing CARD_STYLE border/shadow |
| 21 | PhilosophySection.tsx | Consistency | Minor | 13 | Missing CARD_STYLE border/shadow |

### Priority Fixes (High)

1. **WormPit.tsx line 213/89** — Add `ctx.translate(0, -scrollOffset)` to maintain depth illusion (Rule 10)
2. **ParachuteWorm.tsx lines 73-75** — Replace olive/army green backpack colors with warm browns
3. **WormPit.tsx lines 128-134** — Replace chained if/else density with smooth curve

### Priority Fixes (Medium)

4. **WormPit.tsx lines 244-247** — Apply canonical worm gradient instead of random flat colors
5. **WormPit.tsx line 223** — Cap segments at 14 per performance budget
6. **WormPit.tsx lines 350-394** — Reduce to 2 draw passes per performance budget
7. **ParachuteWorm.tsx line 27** — Change z-[14] to z-[8] per Z constants
8. **BuriedArtifacts.tsx lines 252-263** — Warm up quartz crystal colors
9. **SoilBiology.tsx line 30** — Address fixed positioning for depth elements
10. **BuriedArtifacts.tsx line 39** — Address fixed positioning for depth elements
11. **WormTunnel.tsx lines 70-72** — Replace if/else fade with smooth curve
12. **ParachuteWorm.tsx line 20** — Replace if/else opacity gate with smooth curve
13. **WormPit.tsx lines 206-208** — Replace if/else opacity gate with smooth curve

### Total: 21 findings (3 High, 10 Medium, 8 Minor/Low)
