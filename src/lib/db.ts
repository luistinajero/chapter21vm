import { Book, Order, User } from "./types";

/**
 * JSON-file database with in-memory fallback.
 * Uses filesystem locally, falls back to memory on Vercel (read-only fs).
 * For production persistence on Vercel, replace with Supabase/PostgreSQL.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DB_DIR = join(process.cwd(), "data");

const memoryStore: Record<string, unknown> = {};

function canWriteFs(): boolean {
  try {
    if (!existsSync(DB_DIR)) {
      mkdirSync(DB_DIR, { recursive: true });
    }
    return true;
  } catch {
    return false;
  }
}

const useFs = canWriteFs();

function readJson<T>(filename: string, defaultValue: T): T {
  if (useFs) {
    const filepath = join(DB_DIR, filename);
    if (!existsSync(filepath)) {
      writeFileSync(filepath, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    try {
      return JSON.parse(readFileSync(filepath, "utf-8"));
    } catch {
      return defaultValue;
    }
  }

  if (!(filename in memoryStore)) {
    memoryStore[filename] = defaultValue;
  }
  return memoryStore[filename] as T;
}

function writeJson<T>(filename: string, data: T) {
  if (useFs) {
    const filepath = join(DB_DIR, filename);
    try {
      writeFileSync(filepath, JSON.stringify(data, null, 2));
    } catch {
      memoryStore[filename] = data;
    }
  } else {
    memoryStore[filename] = data;
  }
}

// Books/Inventory
export function getBooks(): Book[] {
  return readJson<Book[]>("books.json", []);
}

export function saveBooks(books: Book[]) {
  writeJson("books.json", books);
}

// Users
export function getUsers(): User[] {
  return readJson<User[]>("users.json", []);
}

export function saveUsers(users: User[]) {
  writeJson("users.json", users);
}

// User passwords (stored separately for security)
interface UserCredential {
  email: string;
  passwordHash: string;
}

export function getCredentials(): UserCredential[] {
  return readJson<UserCredential[]>("credentials.json", []);
}

export function saveCredentials(creds: UserCredential[]) {
  writeJson("credentials.json", creds);
}

// Orders
export function getOrders(): Order[] {
  return readJson<Order[]>("orders.json", []);
}

export function saveOrders(orders: Order[]) {
  writeJson("orders.json", orders);
}

// Password reset tokens
interface ResetToken {
  email: string;
  token: string;
  expires: number;
}

export function getResetTokens(): ResetToken[] {
  return readJson<ResetToken[]>("reset-tokens.json", []);
}

export function saveResetTokens(tokens: ResetToken[]) {
  writeJson("reset-tokens.json", tokens);
}

// Admin credentials
interface AdminCredential {
  username: string;
  passwordHash: string;
}

export function getAdminCredentials(): AdminCredential[] {
  return readJson<AdminCredential[]>("admin.json", []);
}

export function saveAdminCredentials(admins: AdminCredential[]) {
  writeJson("admin.json", admins);
}
