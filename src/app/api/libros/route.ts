import { NextResponse } from "next/server";
import { getBooks } from "@/lib/db";

export async function GET() {
  const books = getBooks();

  const inventory: Record<string, number> = {};
  for (const book of books) {
    const key = `${book.categoria}__${book.idioma}`;
    inventory[key] = (inventory[key] || 0) + book.stock;
  }

  return NextResponse.json({ inventory });
}
