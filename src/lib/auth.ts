import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "chapter21-secret-key-change-in-production";

export function createToken(payload: { id: string; email: string; role?: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { id: string; email: string; role?: string };
  } catch {
    return null;
  }
}
