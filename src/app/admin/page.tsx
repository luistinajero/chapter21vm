"use client";

import { useState } from "react";
import { CATEGORIAS_POR_IDIOMA, IDIOMAS, getCategoriaLabel, getIdiomaLabel } from "@/lib/types";
import type { Book, Order, User } from "@/lib/types";
import { Lock, Package, BookOpen, Plus, Trash2, LogOut, Users } from "lucide-react";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"inventario" | "pedidos" | "usuarios">("inventario");
  const [adminToken, setAdminToken] = useState("");

  // New book form
  const [newTipo, setNewTipo] = useState<"sorpresa" | "edicion-especial">("sorpresa");
  const [newIdioma, setNewIdioma] = useState(IDIOMAS[0].id);
  const [newCategoria, setNewCategoria] = useState(CATEGORIAS_POR_IDIOMA[IDIOMAS[0].id][0].id);
  const [newPrecio, setNewPrecio] = useState(350);
  const [newStock, setNewStock] = useState(1);
  const [newTitulo, setNewTitulo] = useState("");
  const [newDescripcion, setNewDescripcion] = useState("");
  const [adding, setAdding] = useState(false);
  const [addMessage, setAddMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/inventario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      setAdminToken(data.token);
      setAuthenticated(true);
      loadData(data.token);
    } else {
      setError("Credenciales incorrectas");
    }
  };

  const loadData = async (token: string) => {
    const [booksRes, ordersRes, usersRes] = await Promise.all([
      fetch("/api/admin/inventario", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("/api/admin/inventario?type=orders", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("/api/admin/inventario?type=users", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);
    if (booksRes.ok) setBooks((await booksRes.json()).books);
    if (ordersRes.ok) setOrders((await ordersRes.json()).orders);
    if (usersRes.ok) setUsers((await usersRes.json()).users);
  };

  const addBook = async () => {
    setAddMessage("");

    if (!newStock || newStock < 1) {
      setAddMessage("El stock debe ser al menos 1");
      return;
    }

    if (!newPrecio || newPrecio < 1) {
      setAddMessage("El precio debe ser mayor a 0");
      return;
    }

    if (newTipo === "edicion-especial" && !newTitulo.trim()) {
      setAddMessage("El título es obligatorio para ediciones especiales");
      return;
    }

    setAdding(true);

    try {
      const res = await fetch("/api/admin/inventario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          action: "add",
          book: {
            categoria: newCategoria,
            idioma: newIdioma,
            precio: newPrecio,
            stock: newStock,
            tipo: newTipo,
            titulo: newTitulo.trim(),
            descripcion: newDescripcion.trim(),
          },
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setAddMessage(data.error || "No se pudo agregar el libro. Verifica tu sesión de admin.");
        return;
      }

      setAddMessage("Libro agregado correctamente");
      if (newTipo === "edicion-especial") {
        setNewTitulo("");
        setNewDescripcion("");
      }
      await loadData(adminToken);
    } catch {
      setAddMessage("Error de conexión al agregar el libro");
    } finally {
      setAdding(false);
    }
  };

  const deleteBook = async (id: string) => {
    const res = await fetch("/api/admin/inventario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ action: "delete", bookId: id }),
    });
    if (res.ok) loadData(adminToken);
  };

  const deleteUser = async (userId: string) => {
    const res = await fetch("/api/admin/inventario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ action: "deleteUser", userId }),
    });
    if (res.ok) loadData(adminToken);
  };

  const updateOrderStatus = async (orderId: string, estado: string) => {
    const res = await fetch("/api/admin/inventario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ action: "updateOrder", orderId, estado }),
    });
    if (res.ok) loadData(adminToken);
  };

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)] mb-4">
            <Lock className="w-8 h-8 text-[var(--color-gold)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Panel de Administración</h1>
          <p className="text-gray-600 text-sm mt-1">Ingresa tus credenciales de administrador</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            required
          />
          <button type="submit" className="w-full btn-primary py-3">
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  const formatAddress = (dir: User["direccion"]) => {
    if (typeof dir === "string") return dir;
    return `${dir.calle} ${dir.numero}, ${dir.ciudad}, ${dir.estado}, ${dir.pais} CP ${dir.codigoPostal}`;
  };

  const formatPreferences = (u: User) => {
    const idiomas = u.idiomasPreferidos.map(getIdiomaLabel).join(", ") || "—";
    const categorias = u.categoriasPreferidas.map(getCategoriaLabel).join(", ") || "—";
    return { idiomas, categorias };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Panel de Administración</h1>
        <button
          onClick={() => setAuthenticated(false)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500"
        >
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("inventario")}
          className={`pb-2 px-4 font-medium flex items-center gap-2 ${
            activeTab === "inventario"
              ? "border-b-2 border-[var(--color-accent)] text-[var(--color-accent)]"
              : "text-gray-500"
          }`}
        >
          <BookOpen className="w-4 h-4" /> Inventario
        </button>
        <button
          onClick={() => setActiveTab("pedidos")}
          className={`pb-2 px-4 font-medium flex items-center gap-2 ${
            activeTab === "pedidos"
              ? "border-b-2 border-[var(--color-accent)] text-[var(--color-accent)]"
              : "text-gray-500"
          }`}
        >
          <Package className="w-4 h-4" /> Pedidos
        </button>
        <button
          onClick={() => setActiveTab("usuarios")}
          className={`pb-2 px-4 font-medium flex items-center gap-2 ${
            activeTab === "usuarios"
              ? "border-b-2 border-[var(--color-accent)] text-[var(--color-accent)]"
              : "text-gray-500"
          }`}
        >
          <Users className="w-4 h-4" /> Usuarios
        </button>
      </div>

      {/* INVENTARIO TAB */}
      {activeTab === "inventario" && (
        <>
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Agregar al inventario
            </h2>

            {/* Tipo selector */}
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => setNewTipo("sorpresa")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  newTipo === "sorpresa"
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Libro Sorpresa
              </button>
              <button
                type="button"
                onClick={() => setNewTipo("edicion-especial")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  newTipo === "edicion-especial"
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Edición Especial
              </button>
            </div>

            {/* Title and description for special editions */}
            {newTipo === "edicion-especial" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={newTitulo}
                  onChange={(e) => setNewTitulo(e.target.value)}
                  placeholder="Título del libro"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={newDescripcion}
                  onChange={(e) => setNewDescripcion(e.target.value)}
                  placeholder="Descripción breve"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={newIdioma}
                onChange={(e) => {
                  setNewIdioma(e.target.value);
                  const cats = CATEGORIAS_POR_IDIOMA[e.target.value] || [];
                  if (cats.length > 0) setNewCategoria(cats[0].id);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                {IDIOMAS.map((i) => (
                  <option key={i.id} value={i.id}>{i.bandera} {i.nombre}</option>
                ))}
              </select>
              <select
                value={newCategoria}
                onChange={(e) => setNewCategoria(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                {(CATEGORIAS_POR_IDIOMA[newIdioma] || []).map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              <input
                type="number"
                value={newPrecio}
                onChange={(e) => setNewPrecio(Number(e.target.value))}
                placeholder="Precio"
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(Math.max(1, Number(e.target.value) || 1))}
                placeholder="Stock"
                min={1}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              type="button"
              onClick={addBook}
              disabled={adding}
              className="btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? "Agregando..." : "Agregar"}
            </button>
            {addMessage && (
              <p className={`mt-3 text-sm font-medium ${addMessage.includes("correctamente") ? "text-green-600" : "text-red-600"}`}>
                {addMessage}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">Tipo</th>
                  <th className="text-left p-4">Título</th>
                  <th className="text-left p-4">Categoría</th>
                  <th className="text-left p-4">Idioma</th>
                  <th className="text-left p-4">Precio</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400">
                      No hay libros en el inventario
                    </td>
                  </tr>
                ) : (
                  books.map((book) => (
                    <tr key={book.id} className="border-t border-gray-100">
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          book.tipo === "edicion-especial"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {book.tipo === "edicion-especial" ? "Especial" : "Sorpresa"}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{book.titulo || "—"}</td>
                      <td className="p-4">{book.categoria}</td>
                      <td className="p-4">{book.idioma}</td>
                      <td className="p-4">${book.precio} MXN</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          book.stock > 5 ? "bg-green-100 text-green-700" :
                          book.stock > 0 ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {book.stock} disponibles
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => deleteBook(book.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* PEDIDOS TAB */}
      {activeTab === "pedidos" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-gray-200 text-center text-gray-400">
              No hay pedidos
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="font-bold text-[var(--color-primary)]">
                      Pedido #{order.id.slice(0, 8)}
                    </span>
                    <span className="text-sm text-gray-400 ml-3">{order.fecha}</span>
                  </div>
                  <select
                    value={order.estado}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                  </select>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  📍 {order.direccionEnvio}
                </p>
                <div className="space-y-1">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm text-gray-700">
                      {item.cantidad}x {item.categoria} ({item.idioma}) — ${item.precio * item.cantidad} MXN
                    </p>
                  ))}
                </div>
                <p className="text-right font-bold mt-2">Total: ${order.total} MXN</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* USUARIOS TAB */}
      {activeTab === "usuarios" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 mb-2">
            <p className="text-sm text-gray-500">{users.length} usuario(s) registrado(s)</p>
          </div>

          {users.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-gray-200 text-center text-gray-400">
              No hay usuarios registrados
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4">Nombre</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Teléfono</th>
                    <th className="text-left p-4">Idiomas</th>
                    <th className="text-left p-4">Géneros</th>
                    <th className="text-left p-4">Dirección</th>
                    <th className="text-left p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const prefs = formatPreferences(user);
                    return (
                    <tr key={user.id} className="border-t border-gray-100">
                      <td className="p-4 font-medium">{user.nombre}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.telefono}</td>
                      <td className="p-4 text-xs text-gray-600 max-w-[120px]">{prefs.idiomas}</td>
                      <td className="p-4 text-xs text-gray-600 max-w-[160px]">{prefs.categorias}</td>
                      <td className="p-4 text-xs text-gray-600 max-w-xs truncate">
                        {formatAddress(user.direccion)}
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`¿Eliminar al usuario ${user.nombre}?`)) {
                              deleteUser(user.id);
                            }
                          }}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
