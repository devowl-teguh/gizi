# Vercel Web Analytics

Added 5 November 2026 using `@vercel/analytics/next`. The client component is mounted in the root layout so Vercel can record homepage visits once Web Analytics is enabled in the project's Vercel dashboard and the change has been deployed.

## Privacy boundaries

- Only page views for `/` are allowed; other routes and all custom events are dropped until reviewed.
- The `beforeSend` filter removes query strings and URL fragments and forwards only the origin and `/` for allowed page views.
- No profile, date of birth, ingredients, allergies, or AI question is sent as a custom analytics event. Do not add personal information to URLs or analytics events.
- Vercel may process standard analytics metadata, including referrer, device/browser, and approximate location. A visitor-facing notice is in the session privacy dialog. Vercel's actual processing and referrer handling are outside the local session reset: https://vercel.com/docs/analytics/privacy-policy.
- Analytics does not store profile data in local application state or add an application login/database. Local session reset does not delete analytics already sent to Vercel.

## Deployment and verification

1. Enable Analytics for the project in the Vercel dashboard.
2. Deploy this change and visit the production website.
3. Open the Vercel project's Analytics dashboard and check for a page view. Local `next dev` uses the SDK's development mode and does not establish that production collection is enabled.

The project's production AI gate is independent of Analytics and remains disabled until its existing hosting safeguards are in place.
