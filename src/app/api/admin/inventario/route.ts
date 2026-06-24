import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { verifyToken, createToken } from "@/lib/auth";
import {
  getBooks,
  saveBooks,
  getOrders,
  saveOrders,
  getAdminCredentials,
  saveAdminCredentials,
} from "@/lib/db";

async function ensureDefaultAdmin() {
  const admins = getAdminCredentials();
  if (admins.length === 0) {
    const hash = await bcrypt.hash("chapter21admin", 10);
    admins.push({ username: "admin", passwordHash: hash });
    saveAdminCredentials(admins);
  }
  return admins;
}

function isAdminAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return false;
  const payload = verifyToken(token);
  return payload?.role === "admin";
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  if (type === "orders") {
    return NextResponse.json({ orders: getOrders() });
  }

  return NextResponse.json({ books: getBooks() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "login") {
      const { username, password } = body;
      const admins = await ensureDefaultAdmin();
      const admin = admins.find((a) => a.username === username);
      if (!admin) {
        return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
      }
      const valid = await bcrypt.compare(password, admin.passwordHash);
      if (!valid) {
        return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
      }
      const token = createToken({ id: "admin", email: "admin@chapter21.com", role: "admin" });
      return NextResponse.json({ token });
    }

    // All other actions require admin auth
    if (!isAdminAuthorized(req)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (action === "add") {
      const { book } = body;
      const books = getBooks();
      books.push({
        id: uuid(),
        categoria: book.categoria,
        idioma: book.idioma,
        precio: book.precio,
        stock: book.stock,
      });
      saveBooks(books);
      return NextResponse.json({ success: true });
    }

    if (action === "delete") {
      const { bookId } = body;
      const books = getBooks().filter((b) => b.id !== bookId);
      saveBooks(books);
      return NextResponse.json({ success: true });
    }

    if (action === "updateOrder") {
      const { orderId, estado } = body;
      const orders = getOrders();
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        order.estado = estado;
        saveOrders(orders);
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
