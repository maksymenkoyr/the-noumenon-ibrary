/**
 * Centralized env-var configuration. Phase 0 establishes the surface;
 * later phases (store, thresholds) fill it in — see docs/roadmap.md §11.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  // OPENROUTER_API_KEY is read lazily so a missing key only fails at call time.
  get openrouterApiKey() {
    return required("OPENROUTER_API_KEY");
  },
  model: process.env.GENERATION_MODEL ?? "nvidia/nemotron-3-super-120b-a12b:free",
  // Placeholders for upcoming phases — wired here so config has a single home.
  databaseUrl: process.env.DATABASE_URL,
};
