import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { getUsers, getResetTokens, saveResetTokens } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const users = getUsers();
    const user = users.find((u) => u.email === email);

    // Always return success to avoid revealing if email exists
    if (!user) {
      return NextResponse.json({ success: true, message: "Si el email existe, recibirás un correo." });
    }

    const resetToken = uuid();
    const expires = Date.now() + 60 * 60 * 1000; // 1 hour

    const tokens = getResetTokens();
    // Remove any existing tokens for this email
    const filtered = tokens.filter((t) => t.email !== email);
    filtered.push({ email, token: resetToken, expires });
    saveResetTokens(filtered);

    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Still return success - in production you'd want proper email config
    }

    return NextResponse.json({ success: true, message: "Si el email existe, recibirás un correo." });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
