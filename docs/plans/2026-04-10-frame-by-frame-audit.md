# Frame-by-Frame Audit & Implementation Plan

Every frame is audited against the canonical design rules. Fixes are prioritized by visual impact.

---

## Frame 1: Hero (scroll 0-5%)

**Current state:** Logo, plane, moon, stars, skyline, grass, drop clock, scroll indicator

**Issues:**
1. Grass blades too thin/sparse — look like lines, not lush anime grass
2. Plane sometimes overlaps the logo zone
3. Purple glow bleeding on right viewport edge
4. Worm scroll indicator barely visible
5. Empty dark space between tagline and grass

**Fixes:**
- [ ] AnimeGrass: increase blade `width` from 2-5 to 4-8, increase `bladeCount` to 120, brighter greens
- [ ] ScrollIndicator: add faint "scroll to dig" text below the worm
- [ ] Check what causes right-edge purple bleed (likely SurfaceScene gradient)
- [ ] Add a faint suggestion of what's below — maybe a few straw fibers starting to appear at the very bottom edge

---

## Frame 2: Sky→Soil Transition (scroll 5-15%)

**Current state:** Surface scene fading, earth colors appearing

**Issues (predicted):**
- Potential visible color seam between sky and earth
- Grass should fade naturally
- The parachute worm should be descending here

**Fixes:**
- [ ] Verify sky→earth color convergence at rgb(10,15,26)
- [ ] Ensure grass fades with SurfaceScene
- [ ] Parachute worm visibility check

---

## Frame 3: Brand Section (scroll 15-25%)

**Current state:** "Grown From the Ground Up" card, straw texture, tunnel starting

**Issues (predicted):**
- Straw texture may still be too faint
- Tunnel/worm visibility and sync
- Card styling consistency

**Fixes:**
- [ ] Verify straw texture is visible at this depth
- [ ] Check tunnel worm position and sync
- [ ] Ensure card has grate styling (bolts, lines)

---

## Frame 4: The Grow — Horizontal Scroll (scroll 25-45%)

**Current state:** Cards scroll horizontally, depth frozen, worm hidden

**Issues (predicted):**
- Cards may not scroll properly
- Background should be frozen (no depth transition)
- Worm companion in background

**Fixes:**
- [ ] Verify horizontal scroll works end-to-end
- [ ] Verify depth freeze
- [ ] Check background worm companion visibility

---

## Frame 5: Process Section (scroll 45-60%)

**Current state:** Grow/Harvest/Wash/Press steps, perlite texture, roots starting

**Issues (predicted):**
- Perlite dots may be too large or too small
- Root network visibility
- Card styling

**Fixes:**
- [ ] Verify perlite is visible but not blobby
- [ ] Check root network opacity
- [ ] Ensure grate styling on Process container

---

## Frame 6: Philosophy + Deep Zone (scroll 60-80%)

**Current state:** "Why Living Soil?" card, worms starting to appear, artifacts

**Issues (KNOWN):**
- Skeleton artifacts are too prominent and clustered
- Too many artifacts at the same depth
- Artifacts look like floating clipart
- Dead space between sections

**Fixes:**
- [ ] Reduce ALL artifact base opacity from 0.18/0.10 to 0.08/0.05
- [ ] Spread artifact peakProgress values across wider range (0.65-0.95 instead of 0.78-0.95)
- [ ] Remove some redundant artifacts (do we need BOTH a femur AND hand-bones AND ribcage?)
- [ ] Add intriguing element in the dead space (maybe a single distant worm, or a faint root)

---

## Frame 7: Countdown + Signup (scroll 80-95%)

**Current state:** First Drop countdown, Stay Underground signup, dense worms

**Issues (KNOWN):**
- Worm density may be too uniform
- Countdown number clipping (was fixed but verify)
- Card grate styling

**Fixes:**
- [ ] Verify countdown numbers aren't clipped
- [ ] Check worm density gradient (should be denser at bottom)
- [ ] T-Rex fossil should be visible here if scrolled right

---

## Frame 8: Footer / Colony (scroll 95-100%)

**Current state:** Footer with social links, dense worm colony

**Issues (predicted):**
- Footer may be hard to read over worms
- Colony density may need tuning
- Should feel like the "payoff" — the densest most alive moment

**Fixes:**
- [ ] Verify footer text is readable
- [ ] Check if golden worm / queen worm are findable
- [ ] Colony should be at maximum density here

---

## Global Fixes (apply across all frames)

- [ ] Reduce buried artifact count — keep only the most impactful ones (RAW pack, T-Rex on concrete, ammonite, quartz cluster). Remove redundant skeleton pieces.
- [ ] All artifacts: reduce opacity, ensure scroll-based Y movement
- [ ] Verify no elements freeze in place (canonical rule)
- [ ] Performance check — 60fps throughout
