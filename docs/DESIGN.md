# Design reference

Status: approved by the user on 4 November 2026. Responsive homepage implemented in Next.js.

Selected exploration: **Playful Growth**.

Figma: https://www.figma.com/design/UCbNpWDiSaLURwttuBKfva

- Desktop homepage: node `3:692`, width 1120 px.
- Mobile homepage: node `3:793`, width 390 px.
- Editable layers, auto-layout, and Simple Design System component instances.
- Cream background, purple action color, peach and sage feature cards.
- DM Sans for custom text; imported library components retain library typography (Inter).
- Homepage contains AI search, recipe and stimulation cards, growth/development/vaccine shortcuts, and session privacy text.

Two other explorations (Warm Family and Calm & Trusted) were previewed in chat. Only Playful Growth was created in Figma.

The implementation adds an in-memory child profile, age display, session privacy explanation, and an explicit end-session confirmation. Search and tool dialogs explain their pending status; clinical tools and AI search are not implemented yet. No AI key is included.

The empty component folders contained no reusable UI implementations, and Figma snippets had no resolvable code imports. Local Button and Modal primitives were created for the project. DM Sans and Inter are bundled locally with their OFL licenses; there are no Google Fonts requests at runtime or build time.

Verified in the browser: profile creation, missing/future date validation, search pending state, explicit reset of profile and question, and reset on refresh. Mobile layouts checked at 390px and 320px without horizontal overflow. Desktop reviewed against the approved Figma screenshot.
