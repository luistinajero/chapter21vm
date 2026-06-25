"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { CATEGORIAS, IDIOMAS } from "@/lib/types";
import { ShoppingCart, Check, AlertTriangle } from "lucide-react";

export default function LibrosSorpresaPage() {
  const { addItem } = useCart();
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [selectedIdioma, setSelectedIdioma] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [loadingInventory, setLoadingInventory] = useState(true);

  useEffect(() => {
    fetch("/api/libros")
      .then((res) => res.json())
      .then((data) => setInventory(data.inventory || {}))
      .catch(() => {})
      .finally(() => setLoadingInventory(false));
  }, []);

  const getStock = (): number => {
    if (!selectedCategoria || !selectedIdioma) return 0;
    const key = `${selectedCategoria}__${selectedIdioma}`;
    return inventory[key] || 0;
  };

  const hasStock = getStock() > 0;

  const handleAddToCart = () => {
    if (!selectedCategoria || !selectedIdioma || !hasStock) return;

    const cat = CATEGORIAS.find((c) => c.id === selectedCategoria);
    addItem({
      categoria: cat?.nombre || selectedCategoria,
      idioma: IDIOMAS.find((i) => i.id === selectedIdioma)?.nombre || selectedIdioma,
      cantidad: 1,
      precio: 350,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isSelectionComplete = selectedCategoria && selectedIdioma;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] text-center mb-4">
        Libros Sorpresa
      </h1>
      <p className="text-center text-gray-600 mb-12">
        Selecciona una categoría y un idioma. ¡Nosotros hacemos la magia!
      </p>

      {/* Step 1: Category */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-[var(--color-primary)] mb-4">
          1. ¿Qué género te gustaría?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoria(cat.id)}
              className={`card-hover rounded-xl p-4 text-center border-2 transition-all ${
                selectedCategoria === cat.id
                  ? "border-[var(--color-accent)] bg-white shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="text-3xl mb-1">{cat.emoji}</div>
              <div className="text-sm font-medium text-[var(--color-primary)]">{cat.nombre}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Language */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-[var(--color-primary)] mb-4">
          2. ¿En qué idioma?
        </h2>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          {IDIOMAS.map((idioma) => (
            <button
              key={idioma.id}
              onClick={() => setSelectedIdioma(idioma.id)}
              className={`card-hover rounded-xl p-4 text-center border-2 transition-all ${
                selectedIdioma === idioma.id
                  ? "border-[var(--color-accent)] bg-white shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="text-3xl mb-1">{idioma.bandera}</div>
              <div className="text-sm font-medium text-[var(--color-primary)]">{idioma.nombre}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Summary & Add to Cart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-[var(--color-primary)]">
              Libro Sorpresa
              {selectedCategoria && (
                <span className="text-[var(--color-accent)]">
                  {" "}— {CATEGORIAS.find((c) => c.id === selectedCategoria)?.nombre}
                </span>
              )}
              {selectedIdioma && (
                <span className="text-gray-500">
                  {" "}({IDIOMAS.find((i) => i.id === selectedIdioma)?.nombre})
                </span>
              )}
            </p>
            <p className="text-2xl font-bold text-[var(--color-primary)] mt-1">
              Desde $350 MXN
            </p>

            {isSelectionComplete && !loadingInventory && (
              <div className="mt-2">
                {hasStock ? (
                  <span className="text-sm text-green-600 font-medium">
                    Disponible ({getStock()} en stock)
                  </span>
                ) : (
                  <span className="text-sm text-red-500 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Agotado — no hay inventario disponible
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isSelectionComplete || !hasStock}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              !isSelectionComplete || !hasStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : added
                ? "bg-green-500 text-white"
                : "btn-primary"
            }`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" />
                ¡Agregado!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Agregar al carrito
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
