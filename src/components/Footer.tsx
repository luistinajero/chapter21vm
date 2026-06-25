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
              <li><a href="/libros-sorpresa" className="hover:text-white">Libros Sorpresa</a></li>
              <li><a href="/ediciones-especiales" className="hover:text-white">Ediciones Especiales</a></li>
              <li><a href="/registro" className="hover:text-white">Crear Cuenta</a></li>
              <li><a href="/login" className="hover:text-white">Ingresar</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-[var(--color-gold)]">Síguenos</h3>
            <div className="space-y-2">
              <a
                href="https://www.instagram.com/chapter21vm/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white flex items-center gap-2"
              >
                📸 @chapter21vm en Instagram
              </a>
              <a
                href="https://www.tiktok.com/@chapter21vm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white flex items-center gap-2"
              >
                🎵 @chapter21vm en TikTok
              </a>
            </div>
            <p className="text-gray-500 text-xs mt-4">
              © {new Date().getFullYear()} Chapter 21. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
