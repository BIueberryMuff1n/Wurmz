# Wurmz — The Masterpiece

## The Standard

This site should win Awwwards Site of the Day. Not because it has the most effects, but because every single pixel, transition, and interaction feels like it couldn't exist any other way. The worm journey, the underground world, the brand identity, and the 4/20 hype aren't separate things — they're one inseparable experience.

The test: if you remove any element and the site feels lesser, it stays. If you remove it and nobody notices, it was noise.

---

## Principles

1. **One continuous world.** There are no "sections." There is only earth, getting deeper. Content exists within the earth, not on top of it.

2. **The worm is your companion, not a gimmick.** It enters, guides you, disappears when you need to focus, returns when you need direction. It has personality. It smokes a joint. You feel something when you see it.

3. **Every transition is imperceptible.** Sky becomes mulch becomes soil becomes darkness. You never notice a change — you just realize you're somewhere different. Like actually digging.

4. **The bottom is the payoff.** The entire journey builds toward the colony. When you reach it, you've earned it. The dense, slow, living mass of worms should make you feel like you're looking through glass into a worm bin. This is the screenshot moment.

5. **The brand doesn't explain itself.** The graffiti textures, the Rubik Dirt font, the crimson accents, the attitude in the copy — these don't say "we're edgy." They just ARE. The aesthetic is the message.

---

## The Rebuild: 5 Phases

### Phase 1: The Scroll Spine

**Everything is broken because nothing shares a brain.**

Right now every component does its own scroll listening, its own math, its own timing. This is why the tunnel desyncs from the worm, why soil layers have hard edges, why transitions feel janky.

**The fix:** One `ScrollContext` provider that computes a single `progress` value (0→1) and distributes it to every component. Every visual decision in the entire site derives from this one number. The tunnel position, the soil color, the worm location, the layer opacities — all computed from the same source of truth.

This also means: the logo uses `clip-path: circle(50%)` instead of fighting image crops. Unused component files get deleted. The codebase becomes lean.

**Done when:** You can scroll from top to bottom and every element moves in perfect lockstep. Zero desync. Zero flicker. Zero hard edges.

### Phase 2: The Earth

**The background isn't a background — it's the world.**

Rebuild `UndergroundJourney` as a **continuous color field** — not discrete layers with crossfades, but a mathematically smooth function with 30-50+ color stops that produce an imperceptible gradient from sky to deep earth. Think film color grading, not Photoshop layers.

**The color spine:** A cubic spline interpolation through ~40 hand-tuned RGB control points:

```
0.00  → #0a0f1a  (deep night sky)
0.02  → #0e1525  (sky, hint of warmth)
0.05  → #141c2e  (sky fading)
0.08  → #1a1f30  (purple-brown transition)
0.10  → #1e1c28  (dusk meets earth)
0.12  → #221a20  (first soil hint)
0.14  → #2a1e1a  (amber warmth entering)
0.16  → #352618  (straw/mulch zone begins)
0.18  → #3e2e1a  (golden brown peak)
0.20  → #3a2a18  (straw fading)
0.22  → #362616  (transition to topsoil)
0.25  → #332414  (topsoil begins)
0.28  → #302214  (topsoil with perlite)
0.30  → #2e2012  (mid topsoil)
0.33  → #2a1e10  (topsoil deepening)
0.36  → #261a0e  (transition zone)
0.40  → #22180c  (living soil begins)
0.45  → #1e150a  (rich living soil)
0.50  → #1a1208  (deep living soil)
0.55  → #180f07  (darkening)
0.60  → #150d06  (deep zone begins)
0.65  → #120b05  (approaching colony)
0.70  → #100a04  (near dark)
0.75  → #0e0804  (very deep)
0.80  → #0c0703  (colony zone)
0.85  → #0a0603  (dense dark)
0.90  → #080502  (almost black)
0.95  → #060402  (deepest)
1.00  → #050301  (the bottom — pure underground)
```

Between these stops, use cubic Hermite interpolation (not linear lerp) so there are zero visible steps. The human eye can detect ~1% brightness jumps in smooth gradients — this spacing ensures sub-1% changes between frames.

**Texture layers** also use continuous opacity curves, not stepped crossfades:
- **Straw fibers**: opacity peaks at 0.17, gaussian falloff ±0.06
- **Perlite speckles**: opacity peaks at 0.28, gaussian falloff ±0.08
- **Root networks**: opacity peaks at 0.45, gaussian falloff ±0.10
- **Worm silhouettes**: opacity ramps from 0 at 0.60 to max at 1.00 (one-directional)

Each texture opacity is computed as a smooth gaussian: `exp(-((progress - peak)² / (2 * sigma²)))`. No `if` statements. No `smoothStep`. Pure continuous math.

The tunnel interior samples this SAME color function at whatever Y-position it's passing through, so it always matches its surroundings exactly.

**Done when:** You scroll at 1px/frame speed and cannot identify any transition point. The earth just... changes.

### Phase 3: The Worm

**One character. One thread. The entire journey.**

The worm exists in three states, seamlessly transitioning between them:

1. **Parachute descent** (0-12%): Tiny at top, grows as it falls. Parachute collapses at soil line. Starts very small (almost a dot) — the reveal that it's a worm is part of the delight.

2. **Tunnel digger** (12-80%): The main act. The worm burrows through the earth along a carefully designed path. The tunnel appears flush behind its back — never ahead, never gapped. The path goes off-screen at content sections (so you focus on the content), then returns.
   - **Side profile face**: One droopy stoned eye, subtle smirk
   - **Cone-shaped joint**: Tilted upward at an angle, glowing cherry
   - **Smoke**: Lazy puffs that drift and fade
   
3. **Colony arrival** (80-100%): The worm's tunnel trail leads into the dense worm pit. The tunnel worm fades as the colony takes over. Your guide has led you home.

The horizontal Grow section: the worm turns sideways and moves left-to-right at the same speed as your scroll. It's in the background, behind the cards. The soil layer stays consistent (living soil zone) — no transition during horizontal movement.

**Easter eggs along the tunnel path:**

Scratched into the tunnel walls at specific points — barely visible (5-10% opacity), rough handwritten style, like graffiti left in the underground. You'd miss most of them unless scrolling slowly. Each one is positioned using `offsetPath` at fixed percentages along the tunnel:

- ~15%: "dig deeper" (right as the tunnel starts)
- ~25%: tiny scratched leaf doodle
- ~35%: "🪱 wuz here"
- ~45%: "feed the soil"
- ~55%: small scratched mushroom
- ~65%: "no shortcuts"
- ~72%: "420" (barely visible)
- ~78%: "if you can read this, you're underground"

These use a rough, scratchy font or are drawn as SVG paths to look hand-carved. They're rotated to follow the tunnel angle. They reward the slow scroller — a gift for people who are actually paying attention.

**Done when:** The worm feels like a character you'd put on a t-shirt. It has presence without being cartoonish.

### Phase 4: The Colony

**The payoff. The screenshot. The thing people talk about.**

Canvas-rendered worm simulation with:
- **Realistic locomotion**: Sine wave propagating along body segments with phase delay. Not random wiggling — actual peristaltic movement.
- **Slow**: These are worms, not snakes. Glacially slow. Meditative.
- **Density gradient**: Top of zone: 2-3 small distant worms. Bottom: hundreds, packed, overlapping, large. Like the Instagram photo of your worm bin.
- **Size gradient**: Small at top (far away), large at bottom (macro close-up). The biggest worms at the very bottom should have visible segment rings and highlight sheen.
- **Color variation**: Brownish-reds with natural variance. Some darker, some pinker, some with an orange cast. Like real red wigglers.
- **Depth**: Worms at different "depths" — some brighter (foreground), some dimmer (background). Creates a 3D terrarium feel.

The colony only appears in the bottom ~35% of the scroll. It fades in gradually — first a few, then a swarm, then a mass. By the footer, the entire screen is alive.

**Done when:** Someone who keeps worms looks at it and says "that's what it actually looks like."

### Phase 5: Polish to Obsession

**The 1% that separates good from unforgettable.**

- **Graffiti texture system**: Grunge grain overlay, concrete roughness, splatter speckle. Applied globally but intensity varies by depth — rougher at the surface (street level), smoother underground (organic).
- **Card styling**: Thick dark outlines, flat offset shadows, crimson accent borders. Squared edges. These look like stickers slapped on a wall.
- **Performance**: 60fps everywhere. Canvas worms must be efficient — spatial partitioning for drawing, reduced count on mobile. Every CSS animation uses `transform`/`opacity` only.
- **Mobile**: Everything works at 375px. Horizontal scroll section becomes vertical. Worm pit reduces density but keeps the density gradient. Parachute worm still works.
- **Responsive logo**: `clip-path: circle(50%)` with `object-fit: cover` and slight `scale(1.1)`. Perfect circle, no white edges, regardless of source image.
- **Sound** (optional, stretch): Subtle ambient soil/underground sound that fades in as you scroll deeper. Muted by default, opt-in.

**Brilliant Details — the things people screenshot and share:**

**Along the journey:**
- The worm's joint cherry **flares brighter when passing content sections** — like it takes a puff while you're reading. Subtle ember glow tied to scroll position near content.
- **Buried artifacts in the soil layers** — tiny bones, bottle caps, lost coins, a buried key, embedded at random depths. Barely visible (3-8% opacity), different objects at different soil depths. The archaeology of the underground.
- A **buried "Wurmz" graffiti tag** deep in the soil (~60% scroll) — like someone spray-painted a rock underground. You scroll past it and it's gone.
- At exactly ~50% scroll, the **worm glances backward** — its eye briefly looks toward you (the camera) before turning back. A one-frame fourth-wall break. Blink and you miss it.

**At the colony:**
- **One worm wears a tiny crown** — the queen. You have to find her among hundreds.
- **Hovering over a colony worm makes it squirm faster** — it reacts to your presence through the glass.
- **One golden worm** — 1 in 500 is gold colored. The rarest easter egg.

**Structural:**
- The **scroll indicator is a tiny wiggling worm**, not a chevron arrow.
- **Email signup success rotates** between: "Welcome underground", "You've been wormed", "See you on 4/20", "You're in 🪱"
- **Browser tab title changes as you scroll**: "Wurmz" → "Wurmz — digging..." → "Wurmz — deeper..." → "Wurmz — 🪱🪱🪱"

**Meta / dev easter eggs:**
- HTML source comment: `<!-- You found the source. But the real source is the soil. -->`
- Console.log on page load: `🪱 You're looking at the roots. Respect.`
- A second console message at the colony zone: `🪱🪱🪱 You made it to the bottom. Welcome home.`

**Done when:** You've scrolled through it 50 times and haven't found a single thing that feels wrong.

---

## Priority Order

Phase 1 first (everything depends on it). Then Phase 2 + Phase 3 in parallel (the earth and the worm are independent). Phase 4 after the journey is complete (the colony is the destination). Phase 5 last (polish on top of polish).

## What Gets Cut

- Mycelium network canvas (deleted — noise)
- Floating particles (deleted — noise)  
- Root tendrils SVG (deleted — replaced by soil layer system)
- Worm cursor (deleted — gimmick)
- Aura effect (deleted — replaced by soil layers)
- Organic dividers (already removed)

Less is more. The worm, the earth, the brand. That's it.
