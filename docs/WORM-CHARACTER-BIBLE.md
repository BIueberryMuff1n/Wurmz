# Wurmz Worm Character Bible

## The Character

The worm is the brand mascot and the user's guide through the site. It appears in multiple states but must ALWAYS be visually consistent — same body style, same face, same proportions.

## Visual Spec

### Body
- **Shape:** Rounded rectangle (capsule) with `rx/ry` equal to half the height
- **Color:** Gradient from `#7A2818` (dark end) through `#C43A3A` (mid) to `#8B2020` (other end)
- **Outline:** 2-3px stroke in `rgba(40,12,8,0.7)` — thick dark ink line
- **Segments:** Faint vertical lines at regular intervals, `rgba(60,15,10,0.2)`, 1.5px wide
- **Proportions:** Length is ~8-9x the height. bodyR (half-height) defines everything.

### Face (side profile — always faces direction of travel)
- **Eye:** Single ellipse `#1a0a05`, with white shine dot at `rgba(255,255,255,0.5)`
- **Eyelid:** Heavy droopy lid covering top 40% of eye — `rgba(140,35,25,0.5-0.7)`. This is the "stoned" look.
- **Mouth:** Subtle smirk — short curved path, 0.8-1.5px stroke, `#1a0a05`

### RAW Joint
- **Shape:** Cone — wider at lit end, tapered at filter
- **Paper color:** `#C8B088` (RAW unbleached tan)
- **Filter/crutch:** `#A08050` (darker cardboard) with spiral line hints
- **Cherry:** `#D4641A` core, `#F0A030` glow, `#FFD080` hot center
- **Smoke:** 2-3 circles rising, `rgba(200,200,200,0.02-0.08)`, animated slowly upward
- **Angle:** Tilted upward ~30deg from mouth
- **Watermark:** Tiny "RAW" text at 12% opacity on the paper

### Skateboard (conditional — only when scrolling DOWN)
- **Deck:** Dark rect `#1E1710`, width ~40% of worm body length, height ~4px, rounded ends
- **Grip tape:** Slightly darker rect on top
- **Trucks:** Small gray rects `#888` connecting deck to wheels
- **Wheels:** 4 circles `#E8DCC8` with `#666` bearing dots
- **Position:** Directly under the worm body, touching

## States

### 1. Plane Rider (z-[15])
- Sitting on cockpit edge of biplane
- Body horizontal, tail dangling off edge
- Joint in mouth, skateboard leaning against cockpit wall
- Scale: starts at whatever the plane scale is

### 2. Parachute Descent (z-[14])
- Falling through sky after jump
- Body horizontal under parachute
- Skateboard attached underneath
- Backpack on back
- Scale: starts at 0.25, grows to 1.0
- Fades out at landing (progress 0.85-1.0)

### 3. Tunnel Digger (z-[3])
- Burrowing through earth
- Follows SVG `offset-path` along tunnel
- `offset-rotate: auto` — always faces direction of travel
- Joint cherry flares at content sections (gaussian proximity to 0.25, 0.45, 0.65)
- Backward glance at ~50% (eye mirrors briefly)
- Skateboard appears when scrolling DOWN, disappears when scrolling UP
- Fades out at colony arrival (progress 0.75-0.90)

### 4. Grow Section Companion (z-0, background)
- Moves left-to-right behind horizontal scroll cards
- Same body style but at 25% opacity (background element)
- No skateboard in this state
- Simplified face (just eye + smirk, no joint smoke animation)

### 5. Abandoned Gear (z-[7])
- After parachute landing
- Collapsed parachute + backpack + tipped skateboard on surface
- Low opacity (35%), slight rotation
- Static — no animation

## Size Reference

| State | bodyLen | bodyR | Scale |
|-------|---------|-------|-------|
| Plane rider | 28 | 5.5 | 1x (within plane SVG) |
| Parachute | 58 | 12 | 0.25→1.0 |
| Tunnel digger | 140 | 16 | 1x |
| Grow companion | 180 | 20 | 1x at 25% opacity |
| Abandoned gear | n/a | n/a | static SVG |

## Animation Rules

1. The worm NEVER appears in two states simultaneously
2. Transitions between states use opacity fades (not instant swaps)
3. The face always faces the direction of travel
4. The joint is ALWAYS present (it's part of the character identity)
5. Smoke animation is slow — 3-4 second cycle
6. Body color gradient direction follows travel direction
