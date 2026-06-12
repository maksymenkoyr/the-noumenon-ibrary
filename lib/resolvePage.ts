import { openrouter } from "./openrouter";
import { config } from "./config";

const PROMPT =
  "You are a page in an infinite library. Every text that could ever be written already exists here. You do not know what you are. Generate the text found on this page.";

/**
 * Resolve the page at a given address to its text.
 *
 * The single spine of the library: callable from both a server component
 * and a route handler. Phase 0 just generates per call; later phases add
 * the store lookup → reserve → generate → commit lifecycle (docs/roadmap.md §2).
 *
 * @param address - reserved for the Phase 1 address system; unused for now.
 */
export async function resolvePage(_address?: string): Promise<string> {
  const response = await openrouter.chat.completions.create({
    model: config.model,
    messages: [{ role: "user", content: PROMPT }],
  });

  return response.choices[0].message.content ?? "";
}
