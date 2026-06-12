---
title: Economics
---

# Economics

## Design intent

Non-profit public good by design. Personal income not expected. The library is alive as long as it has balance; it pauses when empty.

---

## API spend cap

- **Hard monthly cap**: ~$10/month
- When the cap is hit, the library enters **explore-only mode** — cache hits continue to work, new page generation is suspended until the next month resets
- Exact threshold numbers not yet finalized — see [Roadmap](./roadmap.md)

---

## Rate limiting

- **Per-visitor generation rate limit**: ~10 new pages/minute
- Purpose: neutralize crawlers and automated bulk generation
- Cache hits (returning to known addresses) do not count against the rate limit

---

## Fuel tank model

The library runs on a publicly visible "fuel tank" — a donation-powered balance. Anyone can top it up. When it's empty, generation pauses.

- Public facing: the tank level is visible to visitors
- Donations go directly to API costs, not to the project maintainer
- No subscription, no paywall

---

## Monetization

Deferred to a later design pass. Out of scope for now.

---

## Cost profile

New page generation is the only recurring cost. Cache hits are free. Moderation runs only on novel pages.

The generate-once model means the marginal cost per visit drops toward zero as the library grows — the same pages are served repeatedly without re-generating.
