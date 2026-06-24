import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { verifyToken } from "@/lib/auth";
import { getOrders, saveOrders, getUsers } from "@/lib/db";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const orders = getOrders().filter((o) => o.userId === payload.id);
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  try {
    const { items } = await req.json();
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    const users = getUsers();
    const user = users.find((u) => u.id === payload.id);
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const total = items.reduce(
      (sum: number, item: { precio: number; cantidad: number }) => sum + item.precio * item.cantidad,
      0
    );

    const order = {
      id: uuid(),
      userId: payload.id,
      items,
      total,
      estado: "pendiente" as const,
      fecha: new Date().toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      direccionEnvio: user.direccion,
    };

    const orders = getOrders();
    orders.push(order);
    saveOrders(orders);

    return NextResponse.json({ success: true, order });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
