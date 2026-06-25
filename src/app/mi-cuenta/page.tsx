"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Package, User, BookOpen } from "lucide-react";
import type { Order, User as UserProfile } from "@/lib/types";
import { getCategoriaLabel, getIdiomaLabel } from "@/lib/types";

export default function MiCuentaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/mi-cuenta");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("chapter21-token");
      Promise.all([
        fetch("/api/auth/perfil", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/pedidos", { headers: { Authorization: `Bearer ${token}` } }),
      ])
        .then(async ([profileRes, ordersRes]) => {
          if (profileRes.ok) {
            const data = await profileRes.json();
            setProfile(data.user);
          }
          if (ordersRes.ok) {
            const data = await ordersRes.json();
            setOrders(data.orders || []);
          }
        })
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  if (loading || !user) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center">Cargando...</div>;
  }

  const estadoColors: Record<string, string> = {
    pendiente: "bg-yellow-100 text-yellow-800",
    enviado: "bg-blue-100 text-blue-800",
    entregado: "bg-green-100 text-green-800",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
            <User className="w-6 h-6 text-[var(--color-gold)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">{user.nombre}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {profile && (profile.idiomasPreferidos.length > 0 || profile.categoriasPreferidas.length > 0) && (
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-sm font-semibold text-[var(--color-primary)] mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Mis preferencias de lectura
            </h2>
            {profile.idiomasPreferidos.length > 0 && (
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Idiomas:</span>{" "}
                {profile.idiomasPreferidos.map(getIdiomaLabel).join(", ")}
              </p>
            )}
            {profile.categoriasPreferidas.length > 0 && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Géneros favoritos:</span>{" "}
                {profile.categoriasPreferidas.map(getCategoriaLabel).join(", ")}
              </p>
            )}
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold text-[var(--color-primary)] mb-4 flex items-center gap-2">
        <Package className="w-5 h-5" />
        Mis Pedidos
      </h2>

      {loadingOrders ? (
        <p className="text-gray-500">Cargando pedidos...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
          <p className="text-gray-500 mb-4">Aún no tienes pedidos</p>
          <a href="/libros-sorpresa" className="btn-primary inline-block">
            Explorar libros
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-sm text-gray-500">Pedido #{order.id.slice(0, 8)}</span>
                  <span className="text-sm text-gray-400 ml-3">{order.fecha}</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${estadoColors[order.estado] || ""}`}>
                  {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
                </span>
              </div>
              <div className="space-y-1">
                {order.items.map((item, i) => (
                  <p key={i} className="text-sm text-gray-700">
                    {item.cantidad}x {item.categoria} ({item.idioma})
                  </p>
                ))}
              </div>
              <p className="text-right font-bold text-[var(--color-primary)] mt-3">
                Total: ${order.total} MXN
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
