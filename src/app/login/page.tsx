"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const registered = searchParams.get("registered");
  const redirect = searchParams.get("redirect") || "/catalogo";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(email, password);
    if (success) {
      router.push(redirect);
    } else {
      setError("Email o contraseña incorrectos");
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setForgotLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      if (res.ok) {
        setForgotSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "Error al enviar correo");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setForgotLoading(false);
    }
  };

  if (forgotMode) {
    if (forgotSent) {
      return (
        <div className="text-center">
          <div className="text-4xl mb-4">📧</div>
          <h2 className="text-xl font-bold text-[var(--color-primary)] mb-2">¡Correo enviado!</h2>
          <p className="text-gray-600 mb-6">
            Si el email está registrado, recibirás un enlace para cambiar tu contraseña.
          </p>
          <button
            onClick={() => { setForgotMode(false); setForgotSent(false); }}
            className="text-[var(--color-accent)] font-medium hover:underline"
          >
            Volver al inicio de sesión
          </button>
        </div>
      );
    }

    return (
      <>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <p className="text-sm text-gray-600 mb-2">
            Ingresa tu email y te enviaremos un enlace para recuperar tu contraseña.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none"
              placeholder="tu@email.com"
            />
          </div>
          <button
            type="submit"
            disabled={forgotLoading}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50"
          >
            {forgotLoading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
          <button
            type="button"
            onClick={() => setForgotMode(false)}
            className="w-full text-sm text-gray-500 hover:text-[var(--color-accent)]"
          >
            Volver al inicio de sesión
          </button>
        </form>
      </>
    );
  }

  return (
    <>
      {registered && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">
          ¡Cuenta creada exitosamente! Ahora inicia sesión.
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent outline-none"
            placeholder="Tu contraseña"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3 text-lg disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <button
          type="button"
          onClick={() => setForgotMode(true)}
          className="w-full text-sm text-gray-500 hover:text-[var(--color-accent)] transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] text-center mb-2">
        Iniciar Sesión
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Ingresa a tu cuenta para continuar
      </p>

      <Suspense fallback={<div className="text-center text-gray-400">Cargando...</div>}>
        <LoginForm />
      </Suspense>

      <p className="text-center text-sm text-gray-600 mt-6">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="text-[var(--color-accent)] font-medium hover:underline">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
