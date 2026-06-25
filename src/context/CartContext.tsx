"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, cantidad: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("chapter21-cart");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("chapter21-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.findIndex(
        (i) => i.categoria === item.categoria && i.idioma === item.idioma
      );
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing].cantidad += item.cantidad;
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeItem(index);
      return;
    }
    setItems((prev) => {
      const updated = [...prev];
      updated[index].cantidad = cantidad;
      return updated;
    });
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
