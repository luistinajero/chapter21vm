import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { getUsers, saveUsers, getCredentials, saveCredentials } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, password, telefono, direccion } = await req.json();

    if (!nombre || !email || !password || !telefono || !direccion) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }

    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 400 });
    }

    const id = uuid();
    const passwordHash = await bcrypt.hash(password, 10);

    users.push({ id, nombre, email, direccion, telefono });
    saveUsers(users);

    const credentials = getCredentials();
    credentials.push({ email, passwordHash });
    saveCredentials(credentials);

    return NextResponse.json({ success: true, message: "Cuenta creada exitosamente" });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
