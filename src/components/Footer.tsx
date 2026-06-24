import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-3">
              <BookOpen className="w-5 h-5 text-[var(--color-gold)]" />
              Chapter 21
            </div>
            <p className="text-gray-400 text-sm">
              Descubre tu próxima lectura favorita. Libros sorpresa seleccionados con amor.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-[var(--color-gold)]">Enlaces</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/catalogo" className="hover:text-white">Catálogo</a></li>
              <li><a href="/registro" className="hover:text-white">Crear Cuenta</a></li>
              <li><a href="/login" className="hover:text-white">Ingresar</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-[var(--color-gold)]">Síguenos</h3>
            <a
              href="https://www.instagram.com/chapter21vm/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white flex items-center gap-2"
            >
              📸 @chapter21vm
            </a>
            <p className="text-gray-500 text-xs mt-4">
              © {new Date().getFullYear()} Chapter 21. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
