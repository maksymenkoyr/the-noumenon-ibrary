import { NextResponse } from "next/server";
import { formatAddress, randomAddress } from "@/lib/address";
import { resolvePage } from "@/lib/resolvePage";

export const runtime = "nodejs";

export async function GET() {
  const text = await resolvePage(formatAddress(randomAddress()));
  return NextResponse.json({ text });
}
