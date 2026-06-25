export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getBooksByTipo } from "@/lib/db";

export async function GET() {
  const books = await getBooksByTipo("sorpresa");

  const inventory: Record<string, number> = {};
  for (const book of books) {
    const key = `${book.categoria}__${book.idioma}`;
    inventory[key] = (inventory[key] || 0) + book.stock;
  }

  return NextResponse.json({ inventory });
}
