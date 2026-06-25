import { NextRequest, NextResponse } from "next/server";
import { verifyToken, createToken } from "@/lib/auth";
import {
  getBooks,
  addBook,
  deleteBook,
  getOrders,
  updateOrderStatus,
  getUsers,
  deleteUser,
  verifyAdminCredentials,
} from "@/lib/db";

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
    const orders = await getOrders();
    return NextResponse.json({ orders });
  }

  if (type === "users") {
    const users = await getUsers();
    return NextResponse.json({ users });
  }

  const books = await getBooks();
  return NextResponse.json({ books });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "login") {
      const { username, password } = body;
      const valid = await verifyAdminCredentials(username, password);
      if (!valid) {
        return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
      }
      const token = createToken({ id: "admin", email: "admin@chapter21.com", role: "admin" });
      return NextResponse.json({ token });
    }

    if (!isAdminAuthorized(req)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (action === "add") {
      const { book } = body;
      await addBook({
        categoria: book.categoria,
        idioma: book.idioma,
        precio: book.precio,
        stock: book.stock,
        tipo: book.tipo || "sorpresa",
        titulo: book.titulo || "",
        descripcion: book.descripcion || "",
      });
      return NextResponse.json({ success: true });
    }

    if (action === "delete") {
      await deleteBook(body.bookId);
      return NextResponse.json({ success: true });
    }

    if (action === "updateOrder") {
      await updateOrderStatus(body.orderId, body.estado);
      return NextResponse.json({ success: true });
    }

    if (action === "deleteUser") {
      await deleteUser(body.userId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
