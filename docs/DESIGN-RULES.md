# Wurmz — Canonical Design Rules

These rules are MANDATORY. Every code change must respect them. When in doubt, refer to this document.

---

## Rule 1: No Hard Edges or Shelves

Nothing in the visual experience should create a visible line, boundary, shelf, or abrupt transition. This includes:
- Background color transitions (must be imperceptible)
- Worm density (must be a smooth gradient, never a band or wall)
- Layer opacity changes (gaussian curves, not steps)
- Content card boundaries (use backdrop-blur, not hard boxes)

**Test:** Scroll slowly. If you can point at any pixel and say "that's where X starts/stops," it's broken.

## Rule 2: Worm Colony Distribution

The worm pit canvas renders worms that are:
- **Bottom-heavy:** Most worms are in the bottom 30% of the viewport
- **Gradually thinning upward:** A few scattered worms above, getting sparser toward the top
- **Never forming a band or line:** No visible "shelf" where worms start/stop
- **Size gradient:** Bigger at bottom (macro/close-up), smaller at top (distant)
- **Slow:** These are worms, not snakes. Glacial movement.
- **Y boundary:** Worms that drift above the upper 30% should gently turn downward, NOT teleport or snap to a boundary

**The mental model:** You're looking at a vertical cross-section of soil. The worms live near the bottom. A few adventurous ones wander up. It's organic, not geometric.

## Rule 3: Scroll Progress Mapping

One scroll progress value (0→1) drives the entire experience. Every visual decision derives from this number.

**Depth freeze during horizontal scroll:** When the Grow section is active (progress ~0.25-0.45), the earth depth/color stays FROZEN at the 0.25 value. The worm is going sideways, not deeper.

## Rule 4: Content Readability

Every content section must have:
- `bg-deep-earth/90-95` background
- `backdrop-blur-sm`
- Content is ALWAYS readable over any background effect
- Content z-index (z-20) is always above all effects

## Rule 5: Color Palette — No Olive/Green

The earth colors are WARM BROWNS, never olive or green. The color spine uses:
- Sky: dark blue-black `rgb(10,15,26)`
- Surface: warm dark browns `rgb(28-42, 18-26, 14-16)`
- Deep: near-black browns `rgb(8-14, 6-10, 4-8)`

**Never:** olive, khaki, army green, or any color where G > R

## Rule 6: The Worm Character

See `docs/WORM-CHARACTER-BIBLE.md` for full spec. Key rules:
- Same gradient/outline/face across ALL states
- Joint is ALWAYS present
- Never appears in two states simultaneously
- Skateboard only when scrolling DOWN
- Face always faces direction of travel

## Rule 7: Sky Scene

- Stars: 16 on desktop, 8 on mobile
- Moon: real phase, transparent dark side, glow follows crescent shape
- Chemtrails: 2 faint parallel lines, top-left area
- NYC skyline: faint silhouette at horizon, proportional landmarks
- Shooting star: smooth cubic bezier arc, fizzles out
- Plane: loops until "Click to Jump," fades with scroll

## Rule 8: Transitions Between Zones

The earth has distinct zones but transitions must be IMPERCEPTIBLE:
- Sky → Surface: shared convergence color `rgb(10,15,26)`
- Surface → Topsoil: warm browns fading in over 10%+ of scroll
- Topsoil → Living Soil: gradual darkening, roots appear
- Living Soil → Deep Earth: continuous darkening
- Deep Earth → Colony: worms gradually appear (density ramp)

## Rule 9: Performance

- Canvas worms: max 800 on desktop, 250 on mobile
- All CSS animations use `transform`/`opacity` only
- SVG elements use `preserveAspectRatio` appropriately
- No `Math.random()` in render (causes hydration mismatch)
- Use `pseudoRandom(seed)` for deterministic randomness

## Rule 10: Mobile

- All content responsive at 375px
- Plane, parachute, worm scaled down on mobile
- Horizontal grow section works on mobile
- Worm pit count reduced on mobile
- Skyline uses `xMidYMid slice` for proportional cropping
