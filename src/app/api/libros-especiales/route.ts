import { NextResponse } from "next/server";
import { getBooksByTipo } from "@/lib/db";

export async function GET() {
  try {
    const books = await getBooksByTipo("edicion-especial");
    return NextResponse.json({ books });
  } catch {
    return NextResponse.json({ books: [] }, { status: 500 });
  }
}
