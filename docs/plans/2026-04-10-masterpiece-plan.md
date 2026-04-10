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

Rebuild `UndergroundJourney` as a proper compositor with mathematically smooth cross-fading between soil layers. Not 5 layers with `smoothStep` — a continuous function that blends through:

- **Sky** (deep blue-black, stars)
- **Surface** (warm amber, straw fibers)  
- **Top soil** (tan-brown, perlite speckles — white dots like in the actual soil mix photo)
- **Living soil** (rich dark brown, faint root networks)
- **Deep earth** (near black, the first distant worms appear)
- **The colony** (black, dense wriggling mass)

Each layer has its own texture overlay that fades in/out with scroll. The transitions take 15-20% of scroll each, overlapping. You should NEVER be able to point at a pixel and say "that's where the transition is."

The tunnel interior dynamically matches whatever layer surrounds it. At the top, light. At the bottom, dark. Always blending.

**Done when:** A designer watches you scroll slowly from top to bottom and says "how is that so smooth?"

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
