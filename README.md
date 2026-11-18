# BenchMatch demo

A small, browser-ready front-end POC for comparing one fictional candidate profile with six fictional roles. Everything runs locally in the browser; it has no build step, package installation, network requests, or external services.

## Open the demo

Open `index.html` in a modern browser. Search roles by title, fictional client, location, required skill, grade, or experience. Use the location dropdown only when you want to filter by a specific location.

## How matching works

- Candidate grade is **B2**. A role accepts it only when its accepted-grades list explicitly contains `B2`; no grade equivalences are assumed.
- Candidate skills are **React**, **TypeScript**, and **QA Testing**. Required skills are compared by exact name, ignoring letter case. The role card lists matching skills and missing requirements separately.
- Candidate relevant experience is **3 years**. The minimum is met when those years are greater than or equal to the role's stated minimum.
- Missing role requirements are shown as **Needs confirmation**, not treated as a match or a rejection.
- London is a preference, not a scoring or filtering rule. It only filters the list when selected in the location dropdown.
- The snapshot figures are counts, not match scores. Roles are not ranked.

## Project files

- `index.html` — page structure and candidate profile
- `styles.css` — responsive layout and visual styling
- `app.js` — fictional role data, transparent comparisons, search, and location filter

This POC intentionally has no uploads, database, login, or AI integration.
