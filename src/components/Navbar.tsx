"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, User, BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[var(--color-primary)] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <BookOpen className="w-6 h-6 text-[var(--color-gold)]" />
            <span>Chapter 21</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/catalogo" className="hover:text-[var(--color-gold)] transition-colors">
              Catálogo
            </Link>
            <Link href="/carrito" className="relative hover:text-[var(--color-gold)] transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-accent)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/mi-cuenta" className="hover:text-[var(--color-gold)] transition-colors flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {user.nombre.split(" ")[0]}
                </Link>
                <button onClick={logout} className="text-sm text-gray-300 hover:text-white">
                  Salir
                </button>
              </div>
            ) : (
              <Link href="/login" className="hover:text-[var(--color-gold)] transition-colors flex items-center gap-1">
                <User className="w-4 h-4" />
                Ingresar
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href="/catalogo" className="block hover:text-[var(--color-gold)]" onClick={() => setMenuOpen(false)}>
              Catálogo
            </Link>
            <Link href="/carrito" className="block hover:text-[var(--color-gold)]" onClick={() => setMenuOpen(false)}>
              Carrito ({itemCount})
            </Link>
            {user ? (
              <>
                <Link href="/mi-cuenta" className="block hover:text-[var(--color-gold)]" onClick={() => setMenuOpen(false)}>
                  Mi Cuenta
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="block text-gray-300 hover:text-white">
                  Salir
                </button>
              </>
            ) : (
              <Link href="/login" className="block hover:text-[var(--color-gold)]" onClick={() => setMenuOpen(false)}>
                Ingresar
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
