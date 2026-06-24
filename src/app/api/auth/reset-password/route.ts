import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getResetTokens, saveResetTokens, getCredentials, saveCredentials } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token y nueva contraseña son requeridos" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
    }

    const tokens = getResetTokens();
    const resetToken = tokens.find((t) => t.token === token);

    if (!resetToken) {
      return NextResponse.json({ error: "Enlace inválido o ya utilizado" }, { status: 400 });
    }

    if (Date.now() > resetToken.expires) {
      const filtered = tokens.filter((t) => t.token !== token);
      saveResetTokens(filtered);
      return NextResponse.json({ error: "El enlace ha expirado. Solicita uno nuevo." }, { status: 400 });
    }

    const credentials = getCredentials();
    const cred = credentials.find((c) => c.email === resetToken.email);
    if (!cred) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    cred.passwordHash = await bcrypt.hash(newPassword, 10);
    saveCredentials(credentials);

    // Remove used token
    const filtered = tokens.filter((t) => t.token !== token);
    saveResetTokens(filtered);

    return NextResponse.json({ success: true, message: "Contraseña actualizada exitosamente" });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
