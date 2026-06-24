"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login?redirect=/carrito");
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem("chapter21-token");
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items }),
      });

      if (res.ok) {
        clearCart();
        setOrderSuccess(true);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-4">
          ¡Pedido realizado!
        </h1>
        <p className="text-gray-600 mb-8">
          Tu pedido ha sido registrado. Te notificaremos cuando esté en camino.
        </p>
        <Link href="/mi-cuenta" className="btn-primary inline-block">
          Ver mis pedidos
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-4">
          Tu carrito está vacío
        </h1>
        <p className="text-gray-600 mb-8">
          ¡Explora nuestro catálogo y agrega un libro sorpresa!
        </p>
        <Link href="/catalogo" className="btn-primary inline-block">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-8">Tu Carrito</h1>

      <div className="space-y-4 mb-8">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex-1">
              <h3 className="font-bold text-[var(--color-primary)]">
                Libro Sorpresa — {item.categoria}
              </h3>
              <p className="text-sm text-gray-500">Idioma: {item.idioma}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(index, item.cantidad - 1)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-lg w-8 text-center">{item.cantidad}</span>
              <button
                onClick={() => updateQuantity(index, item.cantidad + 1)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-right">
              <p className="font-bold text-lg text-[var(--color-primary)]">
                ${item.precio * item.cantidad} MXN
              </p>
            </div>

            <button
              onClick={() => removeItem(index)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Total & Checkout */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xl font-bold text-[var(--color-primary)]">Total</span>
          <span className="text-2xl font-bold text-[var(--color-primary)]">${total} MXN</span>
        </div>

        {!user && (
          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mb-4">
            Necesitas iniciar sesión para completar tu compra.
          </p>
        )}

        <button
          onClick={handleCheckout}
          disabled={processing}
          className="w-full btn-primary text-lg py-4 disabled:opacity-50"
        >
          {processing ? "Procesando..." : user ? "Realizar Pedido" : "Ingresar para Comprar"}
        </button>
      </div>
    </div>
  );
}
