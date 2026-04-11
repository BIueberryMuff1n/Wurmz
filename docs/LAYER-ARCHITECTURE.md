# Wurmz — Visual Layer Architecture

## Z-Index Stack (back to front)

```
z-[1]   body::after        — Grunge texture overlay (mix-blend-mode: overlay)
z-[2]   UndergroundJourney — Continuous color field (44-point spine) + texture layers
z-[3]   WormTunnel         — SVG tunnel path + worm character (absolute, full page height)
z-[4]   WormPit            — Canvas worm colony (fixed, 50% opacity, visible at progress > 0.6)
z-[5]   BuriedArtifacts    — Hidden artifacts in soil layers (fixed)
z-[7]   SurfaceScene       — Night sky, stars, moon, chemtrails, skyline, ground fade (absolute, fades at scrollY/1000)
z-[8]   ParachuteWorm      — Descending worm after jump (fixed)
z-[14]  ParachuteWorm      — Same component, higher for descent phase
z-[15]  PlaneIntro         — Biplane looping in sky (fixed, fades at scrollY/500)
z-[20]  main               — All content sections (relative)
z-[50]  body::before       — Fine grain noise overlay (pointer-events: none)
z-[100] CinematicMode      — Auto-play button (fixed, bottom-right)
```

## SurfaceScene Internal Layer Order (within z-[7])

1. Sky gradient (lowest — full viewport background)
2. Stars (parallax 0.5x)
3. Shooting star SVG (periodic)
4. Chemtrails SVG (parallax 0.4x)
5. Moon with phase (parallax 0.3x)
6. NYC skyline SVG (z-index: 2 within scene, bottom-[12%], parallax 0.6x)
7. Ground fade gradient (bottom 40%, blends to rgb(10,15,26))

## UndergroundJourney Internal Layer Order

1. Base color field (44 color stops, hermite interpolated)
2. Straw texture (gaussian peak at progress 0.17, sigma 0.04)
3. Perlite speckles (gaussian peak at 0.28, sigma 0.06)
4. Root network SVG (gaussian peak at 0.44, sigma 0.08)
5. Deep vignette (ramps in from 0.65 to 0.85)

## Color Convergence Points

The two systems (SurfaceScene + UndergroundJourney) must share the SAME color at their handoff:

- **Convergence color:** `rgb(10, 15, 26)` aka `#0a0f1a`
- SurfaceScene sky gradient ends at this color (100% stop)
- SurfaceScene ground fade uses `rgba(10,15,26,...)` 
- UndergroundJourney COLOR_STOPS starts at `[0.00, 10, 15, 26]` and holds through `[0.01, 10, 15, 26]`
- SurfaceScene fades out at `scrollY / 1000` — during this crossfade both layers show the same color

## Content Section Backdrop Rules

Every content section must have:
- `bg-deep-earth/90` to `bg-deep-earth/95` (near-opaque dark background)
- `backdrop-blur-sm` (blur effects behind)
- This ensures text is ALWAYS readable over tunnel/worm effects

## WormTunnel Visibility Rules

- **Hidden** when `adjustedProgress <= 0.01` (before parachute lands)
- **Visible** from 0.01 to 0.75 at full opacity
- **Fading** from 0.75 to 0.90 (colony arrival transition)
- **Gone** after 0.90 (worm pit takes over)
- Tunnel reveal NEVER exceeds worm tail position (clamped)

## WormPit Visibility Rules

- **Hidden** when `progress <= 0.6`
- **Visible** from 0.6 to 1.0
- Canvas opacity: 0.5 (reduced from 0.85)
- All worm alphas multiplied by 0.6
- Bottom-heavy distribution (y² bias)
- Size scales with depth (bigger at bottom = macro view)
