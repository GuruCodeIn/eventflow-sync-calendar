# Plan: Switch event-share emails from Resend to EmailJS

## Goal
Let event-sharing emails be sent through EmailJS instead of Resend, so the user can use EmailJS's free tier and avoid Resend's domain-verification requirement for third-party inboxes.

## Current state
- `src/services/emailService.ts` calls the `send-event-email` Supabase Edge Function.
- The Edge Function uses `RESEND_API_KEY` and sends from `onboarding@resend.dev`, which only delivers to the Resend account owner.
- In-app notifications for shared events already work via `share_event_with_user`.

## Proposed changes

### 1. Add EmailJS client SDK
Install `@emailjs/browser` so the frontend can send emails directly from the browser.

### 2. Store EmailJS credentials as public env vars
EmailJS credentials (public key, service ID, template ID) are safe for the browser. Add them to `.env` / `.env.example` / `.env.production`:
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`

### 3. Build `emailjsService.ts`
Create `src/services/emailjsService.ts` that:
- Initializes EmailJS with the public key.
- Sends event-share emails using the configured service/template ID.
- Passes dynamic data (event title, date, time, location, sender name/email, permission) as template variables.
- Returns a boolean success flag and logs errors.

### 4. Update `src/services/emailService.ts`
Replace the Resend/Edge-Function path in `sendEmail` with a call to the new EmailJS service. Keep the same `EmailParams` interface so callers don't change.

### 5. Update callers
- `src/components/events/EventModal.tsx`: no logic change needed because it still calls `sendEventShareEmail` from `emailService.ts`.
- Remove or deprecate the `send-event-email` Supabase Edge Function since EmailJS runs client-side.

### 6. UI feedback
Update the share success message so it distinguishes:
- event created + shared in-app
- email sent successfully
- email failed (show EmailJS-specific error)

### 7. Documentation
Add a short README note explaining that EmailJS is used and where to update the template variables in the EmailJS dashboard.

## Files to touch
- `package.json` — add `@emailjs/browser`
- `.env`, `.env.example`, `.env.production` — add EmailJS env vars
- `src/services/emailjsService.ts` — new service
- `src/services/emailService.ts` — switch to EmailJS
- `src/components/events/EventModal.tsx` — minor message cleanup if needed
- `supabase/functions/send-event-email/index.ts` — remove or leave unused
- `README.md` — add EmailJS setup note

## Credentials needed
Before implementing, the user must provide:
- EmailJS public key
- EmailJS service ID
- EmailJS template ID

These will be requested via `add_secret` / env vars after plan approval.

## Trade-offs
- EmailJS free tier has monthly send limits; verify it fits expected volume.
- EmailJS sends from the browser, so template logic lives in the EmailJS dashboard, not in the codebase.
- Resend Edge Function will no longer be used; it can be removed or kept as a fallback.