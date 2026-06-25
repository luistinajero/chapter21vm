"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Check, BookOpen, AlertTriangle } from "lucide-react";
import { Book } from "@/lib/types";

export default function EdicionesEspecialesPage() {
  const { addItem } = useCart();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/libros-especiales")
      .then((res) => res.json())
      .then((data) => setBooks(data.books || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (book: Book) => {
    addItem({
      categoria: book.titulo || "Edición Especial",
      idioma: book.idioma,
      cantidad: 1,
      precio: book.precio,
    });
    setAddedId(book.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] text-center mb-4">
        Libros Ediciones Especiales
      </h1>
      <p className="text-center text-gray-600 mb-12">
        Libros seleccionados especialmente para ti. Ediciones únicas y coleccionables.
      </p>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Cargando libros...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Próximamente tendremos ediciones especiales disponibles.
          </p>
          <p className="text-gray-400 mt-2">
            ¡Síguenos en redes sociales para enterarte cuando estén disponibles!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] h-48 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white/80" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-[var(--color-primary)] mb-2">
                  {book.titulo || "Edición Especial"}
                </h3>
                {book.descripcion && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {book.descripcion}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span className="bg-[var(--color-cream)] px-2 py-1 rounded text-[var(--color-primary)] font-medium">
                    {book.categoria}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {book.idioma}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[var(--color-primary)]">
                    ${book.precio} MXN
                  </span>
                  {book.stock > 0 ? (
                    <button
                      onClick={() => handleAddToCart(book)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                        addedId === book.id
                          ? "bg-green-500 text-white"
                          : "btn-primary"
                      }`}
                    >
                      {addedId === book.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          ¡Listo!
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          Agregar
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-sm text-red-500 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Agotado
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
