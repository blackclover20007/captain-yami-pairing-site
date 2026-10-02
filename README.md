# Captain Yami Pairing Gate

Standalone pairing website for Captain Yami Bot. It is visually separate from the bot panel and gives users a focused flow for an access code, QR or phone-number pairing route, pairing status, and a copyable session handoff.

## Preview

The preview access code is `yami1234`. Run it with Node.js 20 or newer:

```bash
npm start
# open http://localhost:3000
```

The interface is fully responsive and dependency-free. `server.js` serves the page, `/health`, and `/api/bridge/status`.

## Important integration note

The supplied bot archive currently requests a WhatsApp-generated pairing code in the terminal with `sock.requestPairingCode(...)`. It does **not** expose an HTTP pairing API, emit a QR payload to a browser, or send a usable session ID back to WhatsApp. The site therefore runs in honest preview mode: the QR/code surfaces and “Simulate linked state” are interaction previews, and the displayed `YAMI-SESSION-*` value is not a real Baileys credential.

To make this a production pairing gate, connect a server-side Baileys bridge behind the existing UI. The bridge should:

1. Validate the access code on the server, not only in the browser.
2. Start an isolated Baileys auth state per pairing attempt.
3. Stream either a real `connection.update` QR payload or the real WhatsApp-generated pairing code to the browser over SSE/WebSocket.
4. Detect `connection === 'open'` and serialize the session using the format expected by the bot host. Do not expose `auth_info/` or private keys in the browser.
5. Deliver the resulting session identifier only to the linked WhatsApp owner, and show the same value in the protected site session panel.
6. Expire attempts and revoke failed/abandoned auth states.

A future bridge can replace the `POST /api/pairing/request` placeholder in `server.js`; the page already has a single `completePairing()` handoff point to swap for real status events.

## Files

- `index.html` — accessible single-page workflow.
- `styles.css` — obsidian, crimson, parchment visual system.
- `app.js` — access gate, method tabs, status state machine, timer, and copy action.
- `server.js` — static server and bridge status endpoints.
- `manus-routes.json` — managed preview route manifest.
- `plan.md` — design and implementation decisions.

## Security

Change the preview code before any public deployment. Never commit WhatsApp auth state, session strings, `.env` files, or credentials. A session ID should be treated like a secret and rotated if it is exposed.
