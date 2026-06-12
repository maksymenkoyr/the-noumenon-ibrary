import OpenAI from "openai";

/**
 * Shared OpenRouter client. Configured via env (see lib/config.ts).
 * Lives on the Node.js runtime resolution path.
 */
export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});
