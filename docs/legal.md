---
title: Legal & Safety
---

# Legal & Safety

## Jurisdiction

EU / Poland. DSA (Digital Services Act) and GDPR frameworks apply.

---

## Content moderation

**No aesthetic filtering** — the library stays dark, strange, and uncensored by design. Strangeness and darkness are features.

**One moderation pass** on novel pages before storing. Scope: narrow illegal-content categories only (CSAM, incitement, etc.). Not taste, not tone.

### Mechanism

- A **cheap secondary LLM yes/no call** (provider-agnostic). A hosted moderation endpoint is a possible fallback behind the same interface — see [Architecture §7](./architecture.md).
- Runs on novel pages only — not on cache hits
- On fail: **regenerate once** with a fresh seed; if the regeneration also fails, the address becomes a permanent **"dark shelf"** placeholder (`status = dark_shelf`)

### Real-person data

Covered by the moderation pass and reactive takedown. No separate detection system needed at this scale.

---

## Copyright

**Not filterable by construction** — the library generates text; filtering for similarity to copyrighted works is not tractable.

Mitigations:
- Staying non-commercial
- Wandering-only navigation (no reverse text search — you cannot look up whether a passage exists)
- Act on all copyright reports promptly

Legal disclaimer on the site: content is machine-generated fiction; non-commercial project.

---

## Reactive takedown

Committed: report received → address blanked promptly. The address is set to `status = taken_down` and serves a placeholder; it does not re-generate. (See the `pages.status` field in [Architecture §8](./architecture.md).)

No proactive system beyond moderation at generation time.

---

## GDPR

- No user accounts required for wandering
- No personal data collected beyond what's inherent in server logs
- Donation flow: handled by payment processor; not stored locally
- Generation parameters logged per page are not PII

---

## License

**AGPL v3** — anyone running a modified version as a network service must publish their source. Chosen to prevent closed commercial forks of the library.
