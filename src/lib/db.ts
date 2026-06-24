import { supabase } from "./supabase";
import { Book, Order, User, UserAddress } from "./types";

// ==================== USERS ====================

export async function getUsers(): Promise<User[]> {
  const { data } = await supabase.from("users").select("*");
  if (!data) return [];
  return data.map((row) => ({
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    telefono: row.telefono,
    direccion: {
      calle: row.calle,
      numero: row.numero,
      ciudad: row.ciudad,
      estado: row.estado,
      pais: row.pais,
      codigoPostal: row.codigo_postal,
    } as UserAddress,
  }));
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data } = await supabase.from("users").select("*").eq("email", email).single();
  if (!data) return null;
  return {
    id: data.id,
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    direccion: {
      calle: data.calle,
      numero: data.numero,
      ciudad: data.ciudad,
      estado: data.estado,
      pais: data.pais,
      codigoPostal: data.codigo_postal,
    },
  };
}

export async function getUserById(id: string): Promise<User | null> {
  const { data } = await supabase.from("users").select("*").eq("id", id).single();
  if (!data) return null;
  return {
    id: data.id,
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    direccion: {
      calle: data.calle,
      numero: data.numero,
      ciudad: data.ciudad,
      estado: data.estado,
      pais: data.pais,
      codigoPostal: data.codigo_postal,
    },
  };
}

export async function createUser(user: {
  nombre: string;
  email: string;
  telefono: string;
  direccion: UserAddress;
  passwordHash: string;
}): Promise<string> {
  const { data, error } = await supabase
    .from("users")
    .insert({
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono,
      calle: user.direccion.calle,
      numero: user.direccion.numero,
      ciudad: user.direccion.ciudad,
      estado: user.direccion.estado,
      pais: user.direccion.pais,
      codigo_postal: user.direccion.codigoPostal,
      password_hash: user.passwordHash,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Supabase createUser error:", error);
    throw new Error(error.message);
  }
  return data.id;
}

export async function deleteUser(userId: string): Promise<void> {
  await supabase.from("users").delete().eq("id", userId);
}

export async function getPasswordHash(email: string): Promise<string | null> {
  const { data } = await supabase
    .from("users")
    .select("password_hash")
    .eq("email", email)
    .single();
  return data?.password_hash || null;
}

export async function updatePasswordHash(email: string, newHash: string): Promise<void> {
  await supabase.from("users").update({ password_hash: newHash }).eq("email", email);
}

// ==================== BOOKS ====================

export async function getBooks(): Promise<Book[]> {
  const { data } = await supabase.from("books").select("*");
  if (!data) return [];
  return data.map((row) => ({
    id: row.id,
    categoria: row.categoria,
    idioma: row.idioma,
    precio: Number(row.precio),
    stock: row.stock,
  }));
}

export async function addBook(book: Omit<Book, "id">): Promise<void> {
  await supabase.from("books").insert(book);
}

export async function deleteBook(bookId: string): Promise<void> {
  await supabase.from("books").delete().eq("id", bookId);
}

// ==================== ORDERS ====================

export async function getOrders(): Promise<Order[]> {
  const { data: ordersData } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (!ordersData) return [];

  const orders: Order[] = [];
  for (const row of ordersData) {
    const { data: items } = await supabase.from("order_items").select("*").eq("order_id", row.id);
    orders.push({
      id: row.id,
      userId: row.user_id,
      items: (items || []).map((item) => ({
        categoria: item.categoria,
        idioma: item.idioma,
        cantidad: item.cantidad,
        precio: Number(item.precio),
      })),
      total: Number(row.total),
      estado: row.estado,
      fecha: row.fecha,
      direccionEnvio: row.direccion_envio,
    });
  }
  return orders;
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const { data: ordersData } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (!ordersData) return [];

  const orders: Order[] = [];
  for (const row of ordersData) {
    const { data: items } = await supabase.from("order_items").select("*").eq("order_id", row.id);
    orders.push({
      id: row.id,
      userId: row.user_id,
      items: (items || []).map((item) => ({
        categoria: item.categoria,
        idioma: item.idioma,
        cantidad: item.cantidad,
        precio: Number(item.precio),
      })),
      total: Number(row.total),
      estado: row.estado,
      fecha: row.fecha,
      direccionEnvio: row.direccion_envio,
    });
  }
  return orders;
}

export async function createOrder(order: {
  userId: string;
  items: { categoria: string; idioma: string; cantidad: number; precio: number }[];
  total: number;
  direccionEnvio: string;
  fecha: string;
}): Promise<string> {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: order.userId,
      total: order.total,
      estado: "pendiente",
      direccion_envio: order.direccionEnvio,
      fecha: order.fecha,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Supabase createOrder error:", error);
    throw new Error(error.message);
  }

  const orderItems = order.items.map((item) => ({
    order_id: data.id,
    categoria: item.categoria,
    idioma: item.idioma,
    cantidad: item.cantidad,
    precio: item.precio,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) {
    console.error("Supabase order_items error:", itemsError);
  }

  return data.id;
}

export async function updateOrderStatus(orderId: string, estado: string): Promise<void> {
  await supabase.from("orders").update({ estado }).eq("id", orderId);
}

// ==================== RESET TOKENS ====================

export async function saveResetToken(email: string, token: string, expires: number): Promise<void> {
  await supabase.from("reset_tokens").delete().eq("email", email);
  await supabase.from("reset_tokens").insert({ email, token, expires_at: expires });
}

export async function getResetToken(token: string): Promise<{ email: string; expires: number } | null> {
  const { data } = await supabase.from("reset_tokens").select("*").eq("token", token).single();
  if (!data) return null;
  return { email: data.email, expires: data.expires_at };
}

export async function deleteResetToken(token: string): Promise<void> {
  await supabase.from("reset_tokens").delete().eq("token", token);
}

// ==================== ADMIN ====================

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const envUser = process.env.ADMIN_USERNAME || "admin";
  const envPass = process.env.ADMIN_PASSWORD || "chapter21admin";
  if (username === envUser && password === envPass) return true;
  return false;
}
