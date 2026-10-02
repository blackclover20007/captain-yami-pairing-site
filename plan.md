# Captain Yami Pairing Site Plan

## Scope
A standalone, responsive pairing experience separate from the Captain Yami Bot panel. It provides an access gate (`yami1234` in preview), QR/code method selection, method-specific setup steps, live pairing-state feedback, and a copyable session-ID handoff surface.

## Design direction
- **Design movement:** occult editorial / Black Clover-inspired battle UI: obsidian surfaces, crimson energy lines, parchment text, and sharp shield geometry.
- **Core principles:** focused, ritual-like progression; high contrast; explicit trust cues; fast mobile-first actions.
- **Color philosophy:** near-black gives the pairing flow seriousness and depth; crimson marks active power and primary action; warm parchment makes instructions feel human and readable instead of sterile.
- **Layout paradigm:** a two-column command deck on desktop that collapses into a single vertical ritual on mobile, with the status rail always visible before the action panel.
- **Signature elements:** shield-shaped Captain Yami mark, crimson slash accents, and a stitched “seal” treatment around session output.
- **Interaction philosophy:** each action advances one deliberate step; tabs change the pairing ritual without losing entered data; copy actions confirm visibly.
- **Animation:** restrained 200–500ms easing, red line sweeps on active states, subtle pulse on waiting indicators, no distracting continuous motion.
- **Typography system:** Georgia/serif display headlines paired with system sans-serif for controls and operational copy.
- **Brand essence:** a calm, battle-ready doorway from bot deployment to a usable WhatsApp session. Personality: decisive, arcane, dependable.
- **Brand voice:** direct and reassuring. Examples: “Open the gate to your bot.” / “Keep this window open until WhatsApp confirms the link.”
- **Wordmark & logo:** a shield containing a five-point grimoire star, paired with the compact “YAMI / PAIRING GATE” lockup.
- **Signature brand color:** crimson `#c83232`.

## Project structure
- `index.html`: semantic single-page shell and pairing workflow panels.
- `styles.css`: responsive visual system, ritual states, QR card, and mobile layout.
- `app.js`: access-code gate, method tabs, live preview state machine, session-ID copy, and bridge hooks.
- `server.js`: dependency-free static server plus health/bridge-status endpoints.
- `manus-routes.json`: the canonical route declaration for the managed preview.
- `README.md`: deployment and real Baileys bridge notes.
