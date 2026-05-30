# High Roller: Suggestions

## Evangelist Persona

The ideal evangelist is a casual craps fan or board game night regular, mid-20s to late-30s, who plays on their phone while waiting in line or procrastinating. They hang out in r/craps, r/gambling, or the Tabletop Discord and already use dice apps for RPG sessions but find them too serious. They screenshot it when they hit snake eyes during a 4x streak because the gold particles and fire-text look genuinely good in a screenshot. They bounce in 5 seconds if the page feels laggy or the layout looks broken on mobile. Their alternative is a plain random number generator or a barebones dice app with no personality. The share hook is what converts them from solo roller to word-of-mouth.

## Ground Truth (repo HEAD vs live)

### Repo HEAD (commit 043db41, 2026-05-30)
- Working: yes. Two dice, craps scoring (7/11, doubles, snake eyes), streak multiplier, particle FX, roll history (last 20), keyboard support, mobile-friendly.
- Fabricated data: none. All rolls are client-side Math.random(). No fake API calls, no hardcoded "live" data, no stale dates.
- False authority claims: none. No Census, API, or real-time data referenced.
- Last-result badge: IMPLEMENTED in this commit. After the 2.5s celebration fades, a quiet inline badge (55% opacity, accent color, matching border) persists next to the sum showing LUCKY ROLL, DOUBLES, or SNAKE EYES.
- Share-streak button: IMPLEMENTED in the current pass (this pass). Appears when streak >= 2 and the dice are not rolling. Links to a Twitter/X intent with the streak count embedded in the tweet text.

### Live (dice-roller-self.vercel.app, checked 2026-05-30)
- The live build predates commit 043db41. The `lastResult` badge and share-streak button are NOT in the live bundle (confirmed by grepping the deployed JS asset for lastResult and lastResultLabel, which returned empty).
- Deploy gap: repo is 1 commit (last-result badge) plus this pass (share button) ahead of live.
- Flag: deploy needed to flush both fixes.

### og:image
- The OG image tag points to `/og-image.png`, which does not exist in `/public`. The favicon.svg is there but no PNG thumbnail. On first Twitter/X share the card will show no image. Low urgency but visible to anyone who shares.

## Shipped Wave 2 (2026-05-30)

- Generated real 1200x630 branded og-image.png (Python PIL, dark background, dice showing 11, gold accent, ELEVEN! banner, streak badge). Fixes blank share cards on Twitter/X, iMessage, Discord, Slack.
- Added Shift+S keyboard shortcut to open Twitter/X share intent when streak >= 2. Desktop hint updates contextually to show "Shift+S to share".

## Prioritized Plan

### Quick Wins (S effort, no backend, deploy needed to verify)

1. [DONE] Persistent last-result badge after celebration fades (commit 043db41)
   Files: src/App.jsx, src/index.css
   Why: Keeps the last lucky outcome visible at all times so users stay oriented between rolls.

2. [DONE THIS PASS] Share-streak button (streak >= 2, links to Twitter/X intent)
   Files: src/App.jsx, src/index.css
   Why: The single most-shareable moment in a craps toy is a long streak. Give users a one-tap share when they are already feeling lucky. Minimal, styled to match, no tracking, no backend.

3. [DONE wave 2] Add og:image.png 1200x630 branded PNG to /public
   Files: public/og-image.png
   Why: Every share or link paste on Slack, Discord, iMessage shows a blank card. Generated with Python PIL: dark #0a0a0f background, two dice showing 6+5=11, gold accent, ELEVEN! banner, 3x streak badge, "Roll. Streak. Share." tagline.

4. [DONE wave 2] Keyboard shortcut for share (Shift+S when streak >= 2)
   Files: src/App.jsx
   Why: Power users rolling on desktop via Space/Enter can now share without touching the mouse. Desktop hint updates to show "Shift+S to share" when streak is active.

5. Sound toggle: short dice click on roll, chime on lucky outcome (Web Audio API, no files)
   Files: src/App.jsx
   Why: Mobile casino feel. Web Audio synth means zero asset fetch. Opt-in (muted by default). Effort: M.

### Bigger Bets (M to L effort)

6. Persistent best-streak in localStorage with a trophy line ("Best: 5x")
   Files: src/App.jsx
   Why: Gives returning users a goal to beat. Drives repeat opens. Effort: M (5-10 lines, useEffect + localStorage).

7. Shareable streak URL (encode dice outcomes in query string so recipients can replay the same run)
   Files: src/App.jsx, vercel.json
   Why: True viral mechanic for the r/craps evangelist. Effort: M-L (encode/decode, history replay mode). Needs thorough testing.

8. Configurable dice count (1d6, 2d6, 3d6) for RPG users who want a d20 or 3-dice pool
   Files: src/App.jsx, src/index.css
   Why: Expands from craps-only to RPG adjacent without changing the core aesthetic. Effort: L (layout reflow, new scoring logic).
