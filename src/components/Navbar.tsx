"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, User, BookOpen, Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[var(--color-primary)] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Image
              src="/logo.png"
              alt="Chapter 21"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
              priority
            />
            <BookOpen className="w-6 h-6 text-[var(--color-gold)]" />
            <span>Chapter 21</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {/* Dropdown: Categoría */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 hover:text-[var(--color-gold)] transition-colors"
              >
                Categoría
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white text-[var(--color-primary)] rounded-lg shadow-xl py-2 min-w-[220px] z-50">
                  <Link
                    href="/libros-sorpresa"
                    className="block px-4 py-2 hover:bg-[var(--color-cream)] transition-colors font-medium"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Libros Sorpresa
                  </Link>
                  <Link
                    href="/ediciones-especiales"
                    className="block px-4 py-2 hover:bg-[var(--color-cream)] transition-colors font-medium"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Libros Ediciones Especiales
                  </Link>
                </div>
              )}
            </div>

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
            <div className="text-sm text-gray-400 uppercase tracking-wide">Categoría</div>
            <Link href="/libros-sorpresa" className="block pl-3 hover:text-[var(--color-gold)]" onClick={() => setMenuOpen(false)}>
              Libros Sorpresa
            </Link>
            <Link href="/ediciones-especiales" className="block pl-3 hover:text-[var(--color-gold)]" onClick={() => setMenuOpen(false)}>
              Libros Ediciones Especiales
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
