export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, password, telefono, direccion, idiomasPreferidos, categoriasPreferidas } = await req.json();

    if (!nombre || !email || !password || !telefono || !direccion) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }

    if (!direccion.calle || !direccion.numero || !direccion.ciudad || !direccion.estado || !direccion.pais || !direccion.codigoPostal) {
      return NextResponse.json({ error: "Todos los campos de dirección son requeridos" }, { status: 400 });
    }

    if (!Array.isArray(idiomasPreferidos) || idiomasPreferidos.length === 0) {
      return NextResponse.json({ error: "Selecciona al menos un idioma de lectura" }, { status: 400 });
    }

    if (!Array.isArray(categoriasPreferidas) || categoriasPreferidas.length === 0) {
      return NextResponse.json({ error: "Selecciona al menos una categoría de libro" }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await createUser({
      nombre,
      email,
      telefono,
      direccion,
      passwordHash,
      idiomasPreferidos,
      categoriasPreferidas,
    });

    return NextResponse.json({ success: true, message: "Cuenta creada exitosamente" });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
