export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { getUserByEmail, saveResetToken } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ success: true, message: "Si el email existe, recibirás un correo." });
    }

    const resetToken = uuid();
    const expires = Date.now() + 60 * 60 * 1000;

    await saveResetToken(email, resetToken, expires);

    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    return NextResponse.json({ success: true, message: "Si el email existe, recibirás un correo." });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
