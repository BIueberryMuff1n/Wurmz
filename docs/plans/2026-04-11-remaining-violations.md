# Remaining Violations — Phase Plan

Based on full scroll audit + codebase audit report. Prioritized by visual impact.

---

## Phase A: Critical Visual (fix these first)

### A1. Perlite dots still too large in some frames
The perlite SVG speckles at `r = 0.8 + (i % 4) * 0.6` can produce dots up to 3.2px radius. On a 1440px-wide viewport these look like floating orbs. Cap at 2px max.

### A2. Grow section horizontal scroll not smooth
Cards jump/teleport instead of sliding smoothly. The `translateX` calculation may have timing issues with the rAF-based scroll handler.

### A3. Background transition line still faintly visible
Between the SurfaceScene ground fade and the UndergroundJourney there's still a subtle color shift. The ground fade bottom color `rgba(14,10,6,1)` doesn't exactly match the earth spine's value at the same scroll progress.

### A4. Tunnel worm segments too visible at curves
The 6 segments of the tunnel worm show visible gaps at sharp turns. The `segSpacing = 0.002` may need further tightening.

---

## Phase B: Detail & Polish

### B1. The Grow section background worm companion is barely visible
At 25% opacity it's almost invisible. Bump to 35-40%.

### B2. Process section needs grate styling
Missing corner bolts and grate lines unlike the other content cards.

### B3. No soil detail visible in mid-zone (0.35-0.60)
The root network, mycelium, and soil biology features are gaussian-gated to narrow ranges. Many scroll positions show nothing but dark background. Widen the sigma values.

### B4. Hydration warning from moon phase
`getMoonPhase()` uses `Date.now()` which differs server/client. The `useState(null)` pattern is in place but there may be other Date-dependent renders.

---

## Phase C: Consistency

### C1. Not all content cards use DesignSystem imports
Cards should import `CARD_CLASSES`, `CARD_STYLE`, `CornerBolts`, `GrateLines` from DesignSystem.tsx instead of hardcoding values.

### C2. GrowCard doesn't have grate styling
Missing corner bolts, border styling inconsistent with other cards.

### C3. Footer needs polish
Plain dark footer with no character. Should match the underground aesthetic.

---

## Phase D: Performance & Deploy

### D1. Fix remaining hydration warnings
### D2. Mobile final pass
### D3. Deploy to Railway

---

## Priority Order

A1 → A2 → A3 → A4 → B1 → B2 → B3 → B4 → C1 → C2 → C3 → D1 → D2 → D3
