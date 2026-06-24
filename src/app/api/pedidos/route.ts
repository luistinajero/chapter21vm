import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getOrdersByUserId, createOrder, getUserById } from "@/lib/db";

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

  const orders = await getOrdersByUserId(payload.id);
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

    const user = await getUserById(payload.id);
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const total = items.reduce(
      (sum: number, item: { precio: number; cantidad: number }) => sum + item.precio * item.cantidad,
      0
    );

    const dir = user.direccion;
    const direccionEnvio = typeof dir === "string"
      ? dir
      : `${dir.calle} ${dir.numero}, ${dir.ciudad}, ${dir.estado}, ${dir.pais} CP ${dir.codigoPostal}`;

    const fecha = new Date().toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const orderId = await createOrder({
      userId: payload.id,
      items,
      total,
      direccionEnvio,
      fecha,
    });

    return NextResponse.json({ success: true, orderId });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
