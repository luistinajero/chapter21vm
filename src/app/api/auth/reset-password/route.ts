import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getResetToken, deleteResetToken, updatePasswordHash } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token y nueva contraseña son requeridos" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
    }

    const resetData = await getResetToken(token);
    if (!resetData) {
      return NextResponse.json({ error: "Enlace inválido o ya utilizado" }, { status: 400 });
    }

    if (Date.now() > resetData.expires) {
      await deleteResetToken(token);
      return NextResponse.json({ error: "El enlace ha expirado. Solicita uno nuevo." }, { status: 400 });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await updatePasswordHash(resetData.email, newHash);
    await deleteResetToken(token);

    return NextResponse.json({ success: true, message: "Contraseña actualizada exitosamente" });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
