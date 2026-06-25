export interface Book {
  id: string;
  categoria: string;
  idioma: string;
  precio: number;
  stock: number;
  tipo: "sorpresa" | "edicion-especial";
  titulo: string;
  descripcion: string;
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

export const IDIOMAS = [
  { id: "espanol", nombre: "Español", bandera: "🇲🇽" },
  { id: "ingles", nombre: "Inglés", bandera: "🇺🇸" },
];

export const CATEGORIAS_POR_IDIOMA: Record<string, { id: string; nombre: string; emoji: string }[]> = {
  espanol: [
    { id: "novela-juvenil", nombre: "Novelas Juvenil", emoji: "✨" },
    { id: "novela-romantica", nombre: "Novelas Romántica", emoji: "💕" },
    { id: "novela-clasica", nombre: "Novela Clásica", emoji: "📚" },
    { id: "novela-fantasia-ficcion", nombre: "Novela Fantasía/Ficción", emoji: "🐉" },
    { id: "novela-historica", nombre: "Novela Histórica", emoji: "🏛️" },
    { id: "misterio-thriller", nombre: "Misterio y Thriller", emoji: "🔍" },
    { id: "infantil", nombre: "Infantil", emoji: "🧒" },
    { id: "autoayuda", nombre: "Autoayuda", emoji: "🌱" },
  ],
  ingles: [
    { id: "novela-juvenil", nombre: "Novelas Juvenil", emoji: "✨" },
    { id: "novela-romantica", nombre: "Novelas Romántica", emoji: "💕" },
    { id: "novela-clasica", nombre: "Novela Clásica", emoji: "📚" },
    { id: "novela-fantasia-ficcion", nombre: "Novela Fantasía/Ficción", emoji: "🐉" },
    { id: "novela-historica", nombre: "Novela Histórica", emoji: "🏛️" },
    { id: "misterio-thriller", nombre: "Misterio y Thriller", emoji: "🔍" },
    { id: "infantil", nombre: "Infantil", emoji: "🧒" },
  ],
};

export const CATEGORIAS = [
  ...CATEGORIAS_POR_IDIOMA.espanol,
];
