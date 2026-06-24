import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/cambiar-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Chapter 21" <${process.env.SMTP_USER || "noreply@chapter21.com"}>`,
    to: email,
    subject: "Recuperar contraseña — Chapter 21",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2d1b69;">Chapter 21</h2>
        <p>Hola,</p>
        <p>Recibimos una solicitud para recuperar tu contraseña. Haz clic en el siguiente enlace para crear una nueva:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #a855f7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Cambiar mi contraseña
        </a>
        <p style="color: #666; font-size: 14px;">Este enlace expira en 1 hora.</p>
        <p style="color: #666; font-size: 14px;">Si no solicitaste este cambio, ignora este correo.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">Chapter 21 — Libros Sorpresa</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendOrderNotificationEmail(order: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: { categoria: string; idioma: string; cantidad: number; precio: number }[];
  total: number;
  direccion: string;
}) {
  const adminEmail = process.env.ORDER_NOTIFICATION_EMAIL || process.env.SMTP_USER || "";
  if (!adminEmail) return;

  const itemsHtml = order.items
    .map((item) => `<li>${item.cantidad}x ${item.categoria} (${item.idioma}) — $${item.precio * item.cantidad} MXN</li>`)
    .join("");

  const mailOptions = {
    from: `"Chapter 21" <${process.env.SMTP_USER || "noreply@chapter21.com"}>`,
    to: adminEmail,
    subject: `Nuevo Pedido #${order.orderId.slice(0, 8)} — Chapter 21`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2d1b69;">Nuevo Pedido</h2>
        <p><strong>Cliente:</strong> ${order.customerName} (${order.customerEmail})</p>
        <p><strong>Dirección de envío:</strong></p>
        <p style="color: #555;">${order.direccion}</p>
        <p><strong>Artículos:</strong></p>
        <ul>${itemsHtml}</ul>
        <p style="font-size: 18px; font-weight: bold; color: #2d1b69;">Total: $${order.total} MXN</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">Chapter 21 — Libros Sorpresa</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
