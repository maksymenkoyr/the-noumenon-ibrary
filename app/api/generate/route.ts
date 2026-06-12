import { NextResponse } from "next/server";
import { resolvePage } from "@/lib/resolvePage";

export const runtime = "nodejs";

export async function GET() {
  const text = await resolvePage();
  return NextResponse.json({ text });
}
