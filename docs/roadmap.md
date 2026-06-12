---
title: Roadmap
---

# Roadmap

A phased build plan from the current prototype to a public, walkable library. Phases are ordered by dependency, not calendar — each lists its **goal**, **tasks**, what it **depends on**, and a **done-when** bar. Detail for each lives in [Architecture](./architecture.md); this is the sequencing layer.

> **Legend** — `[ ]` todo · `[~]` partial · `[x]` done. Section refs like [§5](./architecture.md) point into Architecture.

---

## Current state

- `[x]` Next.js 16 App Router + TypeScript + Tailwind scaffold
- `[x]` `GET /api/generate` calls OpenRouter and returns a page of text
- `[x]` `app/page.tsx` renders text — but via a localhost self-`fetch` (anti-pattern, [§14](./architecture.md))
- `[]` No address system, no store, no moderation, no rate limit, no UI

Everything below turns that single hardcoded call into the system described in [Architecture](./architecture.md).

---

## Milestones

| Milestone                   | Reached after | Meaning                                                                                      |
| --------------------------- | ------------- | -------------------------------------------------------------------------------------------- |
| **M1 — Walkable library**   | Phase 3       | You can wander by address; pages generate once and persist. Private use; moderation stubbed. |
| **M2 — Safe & sustainable** | Phase 6       | Moderation, spend cap, and rate limits live. Safe to expose.                                 |
| **M3 — Public launch**      | Phase 9       | Backups, legal, reader layer, success-bar passed.                                            |

---

## Phase 0 — Foundation & cleanup

**Goal:** a clean spine to build on; no behavior change visible to a user.
**Depends on:** nothing.

- `[x]` Create `lib/` and move page-resolution logic out of routes/components ([§1](./architecture.md))
- `[x]` Replace `page.tsx` self-`fetch` with a direct `await resolvePage(address)` call ([§14](./architecture.md))
- `[x]` Fix `layout.tsx` metadata (still says "Create Next App")
- `[x]` Set `runtime = 'nodejs'` on the resolution path; establish env-var config (`OPENROUTER_API_KEY` ✓, add `DATABASE_URL`, model ids, thresholds) ([§11](./architecture.md))

**Done when:** the prototype behaves identically but all logic flows through `lib/resolvePage`, callable from both a server component and a route handler.

---

## Phase 1 — Address system

**Goal:** the library has coordinates; you can navigate them.
**Depends on:** Phase 0. **This phase is effectively permanent — lock it carefully.**

- `[ ]` Decide `gallery` alphabet + length bound; decide whether to collapse `wall × shelf` into one 1–20 dimension ([§5](./architecture.md))
- `[ ]` Implement `normalizeAddress(segments)` as a pure function — reject-don't-clamp out-of-range; **exhaustive tests** (changing this later orphans every page)
- `[ ]` Routing: `app/[[...address]]/page.tsx` optional catch-all; `await params`
- `[ ]` `randomAddress()` and `nextAddress(addr)` (page→volume→shelf→… rollover)
- `[ ]` Minimal render: show generated text for a typed/random address (still regenerating per visit — store comes next)

**Done when:** typing `/io-9/3/2/17/308`, hitting random, and stepping "next" all resolve to a page; normalization is test-covered and frozen.

---

## Phase 2 — Page store (Neon Postgres)

**Goal:** generate-once, store-forever. Same address → same page.
**Depends on:** Phase 1 (address is the primary key).

- `[ ]` Provision Neon; wire pooled/serverless connection driver ([§11](./architecture.md))
- `[ ]` Create `pages` table per the [§8](./architecture.md) schema (`status`, nullable `content`/`content_hash`, provenance cols, `content_hash` index)
- `[ ]` `getPage` (store lookup) + `commitPage` (write final state)
- `[ ]` Reserve-then-generate concurrency guard: `INSERT … ON CONFLICT DO NOTHING`, wait-for-winner, stale-reservation reclaim ([§3](./architecture.md))
- `[ ]` Wire the full lifecycle into `resolvePage`: lookup → reserve → generate → commit ([§2](./architecture.md))

**Done when:** revisiting an address returns the identical stored page with no LLM call; two concurrent first-visitors trigger exactly one generation.

---

## Phase 3 — Generation pipeline · 🏁 M1

**Goal:** pages are address-anchored, varied, and provenance-logged.
**Depends on:** Phase 2.

- `[ ]` Inject the normalized address into the prompt as the creative anchor ([§6](./architecture.md), [Generation](./generation.md))
- `[ ]` Entropy levers as config: `model`, `temperature`, `seed_word` (random per gen), `prompt_variant`
- `[ ]` Page-size constraint in the prompt: hard max, no min, "complete not truncated" ([§6](./architecture.md))
- `[ ]` Persist all provenance (`model`, `temperature`, `seed_word`, `prompt_variant`) on commit
- `[ ]` Dedup: `content_hash` collision check → regenerate once with fresh seed ([§8](./architecture.md))
- `[ ]` Stub `moderate()` as always-pass for now (real version in Phase 4)

**Done when:** different addresses reliably yield different pages, every page row carries full provenance, and a 20-page private wander is possible. **🏁 M1 — walkable library.**

---

## Phase 4 — Moderation

**Goal:** never store unmoderated content. Required before any public exposure.
**Depends on:** Phase 3.

- `[ ]` Implement `moderate(text)` as a secondary cheap-LLM yes/no call, narrow illegal-content scope only ([§7](./architecture.md), [Legal](./legal.md))
- `[ ]` Flow: fail → regenerate once with fresh seed → second fail → commit `status = dark_shelf`
- `[ ]` Dark-shelf + taken-down placeholder rendering
- `[ ]` Reactive-takedown path: set `status = taken_down` by address ([Legal](./legal.md))

**Done when:** failing content is never persisted as `ok`; dark-shelf and takedown both resolve to placeholders.

---

## Phase 5 — Reading experience & streaming

**Goal:** the page _feels_ like a page; first-visit latency is masked.
**Depends on:** Phases 3–4.

- `[ ]` Fixed-size leaf rendering: top-aligned text, honest whitespace, max calibrated to fill at display font ([Experience](./experience.md))
- `[ ]` Navigation UI: random / next / typed-address controls
- `[ ]` Stream generation live to the first visitor; moderate the completed buffer before commit ([§4](./architecture.md))
- `[ ]` Explore-only and dark-shelf states surfaced in the UI

**Done when:** a first visit streams in and reads as a finished leaf; revisits load instantly; partial pages look deliberate.

---

## Phase 6 — Economics & safety controls · 🏁 M2

**Goal:** the library can't be bankrupted or crawled.
**Depends on:** Phases 2–3.

- `[ ]` Per-visitor rate limit (~10 new pages/min, IP-keyed; only generations count) ([§10](./architecture.md))
- `[ ]` Monthly spend counter (`tokens × price`); cap → explore-only mode (no crystallization past the cap)
- `[ ]` Decide counter store: Postgres vs. edge KV
- `[ ]` CDN cache headers on committed pages so repeat reads skip the function ([§11](./architecture.md))

**Done when:** generation halts cleanly at the cap with cache hits still served, and a crawler can't exceed the rate limit. **🏁 M2 — safe & sustainable.**

---

## Phase 7 — Permanence & ops

**Goal:** the precious store cannot be lost.
**Depends on:** Phase 2.

- `[ ]` Nightly `pg_dump` to off-provider object storage (beyond Neon's own PITR) ([§9](./architecture.md))
- `[ ]` Periodic automated **test-restore** (an unrestorable backup is not a backup)
- `[ ]` Basic error logging/alerting on generation, moderation, and DB failures

**Done when:** a verified, off-provider, restorable nightly backup exists and is monitored.

---

## Phase 8 — AI reader layer

**Goal:** the AI-as-reader companion central to the premise ([Experience](./experience.md)). Independent of the launch-critical infra above — can move earlier if desired.
**Depends on:** Phase 3 (pages must exist).

- `[ ]` `POST /api/reader`: interpret a page, surface resonant lines, suggest where to walk next — reads, does not generate the library
- `[ ]` "Carried question" input the reader watches for resonance against
- `[ ]` Reader UI alongside the page

**Done when:** on a given page the reader produces a plausible interpretation, a surfaced line, and a next-step suggestion.

---

## Phase 9 — Launch hardening · 🏁 M3

**Goal:** ready for the public.
**Depends on:** Phases 4, 6, 7.

- `[ ]` Legal: machine-generated-fiction disclaimer, non-commercial notice, copyright/abuse report mechanism wired to the takedown path ([Legal](./legal.md))
- `[ ]` Confirm moderation is live (not stubbed) and DSA/GDPR posture documented
- `[ ]` Success-bar test: a meaningful fraction of pages produce a pause across a 20-page wander ([Experience](./experience.md))
- `[ ]` Tune model tier / temperature for the coherence-to-strangeness target zone ([Generation](./generation.md))

**Done when:** the success bar is met and the library is safe, backed up, and legally covered. **🏁 M3 — public launch.**

---

## Resolved decisions

| Decision               | Resolution                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Generation prompt base | Established — see [Generation](./generation.md)                                             |
| Entropy levers         | Seed word injection + `"you do not know what you are"` as primary levers                    |
| Navigation model       | Wandering-only (random / next / typed address); no semantic search                          |
| Address topology       | Human-scaled Borges coordinates: `gallery/wall/shelf/volume/page` ([§5](./architecture.md)) |
| Page model             | Fixed-size leaf, variable text (hard max, no min) — provisional, see Phase 5                |
| Permanence model       | Store-based, not algorithmic seeding                                                        |
| Page store             | Neon Postgres                                                                               |
| LLM provider           | OpenRouter (swappable; model tier to revisit for latency)                                   |
| Moderation method      | Secondary cheap LLM yes/no call; narrow illegal-content only                                |
| License                | AGPL v3                                                                                     |
| Funding model          | Public donation fuel tank; no subscription (system parked)                                  |
| Multi-user model       | One shared canonical library; no per-user sandboxes                                         |

---

## Provisional / to revisit

- **`gallery` alphabet & `wall × shelf` collapse** — settle when locking `normalizeAddress` (Phase 1)
- **Page-size aesthetic** — validate partial pages against the "books are usually full" instinct; may add a soft minimum (Phase 5)
- **Model tier** — stay on `:free` or move to a cheap paid model for latency/no-train (Phase 3/9)
- **Streaming exposure** — live-stream-then-moderate vs. moderate-then-reveal ([§4](./architecture.md))

---

## Parked future ideas

Out of scope for the current version. Do not pull into active work without a separate design pass.

### Algorithmic version

PRNG + rich word pools, AI as guide/reader layer only. Preserves mathematical completeness (all possible strings) rather than experiential completeness.

### Algorithm iteration series

Progressive steps from pure gibberish toward coherence — a companion exhibit showing the library's construction.

### Book-length AI version

Sections, variable length, more literary structure. Longer-form reading experience. Would rethink the address system.

### Hybrid free-form addressing

Map typed _phrases_ into gallery coordinate space, on top of the coordinate system ([§5](./architecture.md)).

### Paid tier / monetization

Deferred. Do not design for this yet.

### Fuel tank / donations system

Concept documented in [Economics](./economics.md); schema + payment webhook deliberately not built yet ([§8](./architecture.md)).
