import { Book, Order, User } from "./types";

/**
 * Simple JSON-file database for development.
 * In production, replace with Supabase/PostgreSQL.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DB_DIR = join(process.cwd(), "data");

function ensureDbDir() {
  if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true });
  }
}

function readJson<T>(filename: string, defaultValue: T): T {
  ensureDbDir();
  const filepath = join(DB_DIR, filename);
  if (!existsSync(filepath)) {
    writeFileSync(filepath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  return JSON.parse(readFileSync(filepath, "utf-8"));
}

function writeJson<T>(filename: string, data: T) {
  ensureDbDir();
  const filepath = join(DB_DIR, filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2));
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

// Admin credentials
interface AdminCredential {
  username: string;
  passwordHash: string;
}

export function getAdminCredentials(): AdminCredential[] {
  const defaultAdmin: AdminCredential[] = [];
  return readJson<AdminCredential[]>("admin.json", defaultAdmin);
}

export function saveAdminCredentials(admins: AdminCredential[]) {
  writeJson("admin.json", admins);
}
