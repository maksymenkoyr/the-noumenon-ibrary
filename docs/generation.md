---
title: Generation
---

# Generation

The generation prompt is **the highest-leverage artifact in the project**. It requires real iteration. Everything else can be changed; a poor prompt poisons every page.

---

## Current base prompt

> *You are a page in an infinite library. Every text that could ever be written already exists here. You do not know what you are. Generate the text found on this page.*

This is the prompt currently deployed in `app/api/generate/route.ts`.

---

## Word choice matters

| Word | Effect |
|---|---|
| `written` | Pulls toward facts, documentation, reference material |
| `imagined` | Pulls toward interiority, inner states, dreams |
| `idea` | Acts as a hidden instruction — model tries to *have* one, produces formulaic output. **Avoid.** |

Framing the text as pre-existing (rather than being generated) frees the model from intentionality. *"Generate the text found on this page"* — not *"write a page."*

---

## Entropy levers

Entropy levers stack. The uncanny target zone lives in the middle of the journey from coherence toward strangeness.

| Lever | How it works |
|---|---|
| Temperature | Higher = stranger. Start coherent, drift over time. |
| Model selection | Different models have different gravity wells — combining them widens the range. |
| Seed word injection | Append a random word per generation. Anchors the page without determining it. |
| Prompt variation | Structural mutations to the base prompt. The prompt itself becomes entropy over time. |
| `"you do not know what you are"` | Removes the model's self-orientation; prevents purposeful generation. One of the most effective single phrases found so far. |

Two confirmed effective levers: (1) random seed word appended per generation, (2) `"you do not know what you are"`.

---

## Geological time

The library drifts toward strangeness as entropy levers accumulate over time:
- Early pages: more coherent
- Later pages: stranger
- Visitors returning years later feel the shift
- The uncanny target zone lives in the middle of that journey

This is intentional. The library ages. Its texture changes.

---

## Multi-model generation

Different models have different gravity wells — the latent space each model learned from is shaped differently. Mixing models across pages increases the range of page types and prevents the library from converging on one aesthetic.

Generation parameters are logged per page as provenance (see [Architecture](./architecture.md) store schema). Cross-referenced with engagement signals (dwell time) this becomes research data on what produces pages worth pausing on.

---

## Page size

🟡 Provisional. The page is a **fixed-size leaf** with a **hard maximum** and **no minimum** — same container, variable amount of text (see [Architecture §5–6](./architecture.md)). The prompt states the max explicitly.

The guarantee is **completeness, not fullness**: a page may end early and sit in white space, but must read as a finished artifact — never truncated mid-thought. A short, complete fragment is fine (often the most resonant kind of page); a cut-off page is the hollow failure mode below. Calibrate the max to actually fill the leaf at the display font so "full" pages look full.

To revisit after feel-testing — real books tend toward full pages, so the partial-page aesthetic needs to earn its keep.

---

## Primary failure mode

**Coherent but hollow** — readable, forgettable, empty.

A page that sounds like a library page without being one. The test: does it produce a pause? Does a reader find themselves reading it again?

The 20-page personal wander test: a meaningful fraction of pages in a 20-page wander should produce a pause.

---

## Anti-patterns

- Prompt that asks the model to *explain* or *describe* — produces encyclopedic output
- Mentioning the Library of Babel by name — model quotes Borges
- Asking for "a strange page" — model performs strangeness; hollow
- Using `idea` as an object noun — model tries to *have* an idea and announces it
