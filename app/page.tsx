import { resolvePage } from "@/lib/resolvePage";

export const runtime = "nodejs";

export default async function Home() {
  const text = await resolvePage();

  return (
    <main>
      <p>{text}</p>
    </main>
  );
}
