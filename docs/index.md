---
title: The Noumenon Library
---

# The Noumenon Library

An infinite, shared, AI-generated library built on the Library of Babel concept. Every address yields a permanent, strange, coherent-but-dreamlike page — crystallized on first visit, stored forever.

Named after Kant's *noumenon*: the thing that exists beyond what can ever be fully perceived or known.

---

## Documentation

| Section | Description |
|---|---|
| [Concept](./concept.md) | What the library is, the core premise, and its philosophical grounding |
| [Architecture](./architecture.md) | Technical design, data model, and tech stack |
| [Generation](./generation.md) | Prompt engineering, entropy levers, and anti-patterns |
| [Experience](./experience.md) | Navigation model, the AI reader layer, and the user journey |
| [Economics](./economics.md) | API spend model, rate limits, and the fuel tank |
| [Legal & Safety](./legal.md) | Moderation, copyright, GDPR/DSA, and takedown policy |
| [Roadmap](./roadmap.md) | Open tickets, resolved decisions, and parked future ideas |

---

## Current State

Early prototype. The generation loop works end-to-end: `GET /api/generate` calls OpenRouter, returns a page of text. No address system, no store, no UI yet.

- **Runtime**: Next.js App Router + TypeScript
- **Model in use**: `nvidia/nemotron-3-super-120b-a12b:free` via OpenRouter
- **Prompt in use**: see [Generation](./generation.md)
