WhatsApp Deep-Link Verification (Approval-Free)

Objectives
- Verify user ownership of a WhatsApp number without requiring WhatsApp Cloud API approval.
- Use wa.me deep links with a one-time code; verify via an inbox listener you control (bridge).

Actors
- API (Auth Service)
- Inbox Listener (Bridge): receives inbound WhatsApp messages for your number (e.g., via WhatsApp Web automation, Twilio-compatible gateway you host, or a supervised device).
- Client App (Android/iOS/PWA)

Flow
1) Client calls `POST /auth/wa/start` with `phone`.
   - API creates a short-lived session with a one-time code (e.g., 6 digits) and returns a wa.me deep link:
     `https://wa.me/<your_number>?text=CODE%20123456%20SESSION%203f1a...`
   - Client opens link; user hits send in WhatsApp.
2) Inbox Listener receives the inbound message.
   - Extract session ID and code (format rigid and well-documented).
   - POST to internal API endpoint (or queue) to mark the session as verified for that phone number.
3) Client polls or calls `POST /auth/wa/verify` with `session_id` and `code`.
   - API validates: code match, within TTL, and listener has seen inbound message from the expected phone.
   - If valid, mint JWT and refresh token; create user if new.

Design Notes
- Rate limit `/auth/wa/start` by IP/device and phone.
- Session TTL: 5–10 minutes; single-use; invalidate on success.
- Store code hashes (not plaintext). Include device fingerprint claims if available.
- Bridge reliability: queue messages; retry on network blips; audit log verifications.
- Migration path: swap the bridge with WhatsApp Cloud API (same client contract).

Data Model (auth-specific)
- `wa_sessions(id, phone, code_hash, status(pending|verified|expired), created_at, expires_at, verified_at, device_info)`
- `users` stores phone as unique identifier; optional email fallback.

Failure Modes
- No inbound message: user didn’t send or wrong number. UI allows resend/regenerate.
- Mismatched phone: block with generic error; do not leak which numbers exist.
- Replay attempts: session single-use; invalidate on success.

