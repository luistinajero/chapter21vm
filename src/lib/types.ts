export interface Book {
  id: string;
  categoria: string;
  idioma: string;
  precio: number;
  stock: number;
}

export interface CartItem {
  categoria: string;
  idioma: string;
  cantidad: number;
  precio: number;
}

export interface UserAddress {
  calle: string;
  numero: string;
  ciudad: string;
  estado: string;
  pais: string;
  codigoPostal: string;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: UserAddress;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  estado: "pendiente" | "enviado" | "entregado";
  fecha: string;
  direccionEnvio: string;
}

export const CATEGORIAS = [
  { id: "romance", nombre: "Romance", emoji: "💕", color: "bg-pink-100 text-pink-800" },
  { id: "misterio", nombre: "Misterio", emoji: "🔍", color: "bg-purple-100 text-purple-800" },
  { id: "fantasia", nombre: "Fantasía", emoji: "🐉", color: "bg-indigo-100 text-indigo-800" },
  { id: "ciencia-ficcion", nombre: "Ciencia Ficción", emoji: "🚀", color: "bg-blue-100 text-blue-800" },
  { id: "thriller", nombre: "Thriller", emoji: "😱", color: "bg-red-100 text-red-800" },
  { id: "clasicos", nombre: "Clásicos", emoji: "📚", color: "bg-amber-100 text-amber-800" },
  { id: "desarrollo-personal", nombre: "Desarrollo Personal", emoji: "🌱", color: "bg-green-100 text-green-800" },
  { id: "juvenil", nombre: "Juvenil", emoji: "✨", color: "bg-cyan-100 text-cyan-800" },
];

export const IDIOMAS = [
  { id: "espanol", nombre: "Español", bandera: "🇲🇽" },
  { id: "ingles", nombre: "Inglés", bandera: "🇺🇸" },
];
