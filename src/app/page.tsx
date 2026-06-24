import Link from "next/link";
import { BookOpen, Gift, Truck, Heart } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
              <BookOpen className="w-12 h-12 text-[var(--color-gold)]" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Tu próximo libro favorito
            <br />
            <span className="text-[var(--color-gold)]">es una sorpresa</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Elige una categoría y un idioma. Nosotros elegimos el libro perfecto para ti.
            Envuelto con amor, listo para descubrir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalogo" className="btn-primary text-lg px-8 py-4">
              Explorar Catálogo
            </Link>
            <a
              href="https://www.instagram.com/chapter21vm/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-lg px-8 py-4"
            >
              📸 Síguenos en Instagram
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--color-primary)] mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              step={1}
              icon={<Gift className="w-8 h-8" />}
              title="Elige tu categoría"
              description="Romance, misterio, fantasía, ciencia ficción... ¡Tú decides el género!"
            />
            <StepCard
              step={2}
              icon={<Heart className="w-8 h-8" />}
              title="Nosotros elegimos"
              description="Seleccionamos cuidadosamente un libro que te va a encantar. ¡Es sorpresa!"
            />
            <StepCard
              step={3}
              icon={<Truck className="w-8 h-8" />}
              title="Recíbelo en casa"
              description="Tu libro llega envuelto y listo para disfrutar. ¡La emoción de abrir un regalo!"
            />
          </div>
        </div>
      </section>

      {/* Categories preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--color-primary)] mb-4">
            Categorías disponibles
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
            Cada libro es seleccionado a mano. No sabrás cuál es hasta que lo abras.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: "💕", name: "Romance" },
              { emoji: "🔍", name: "Misterio" },
              { emoji: "🐉", name: "Fantasía" },
              { emoji: "🚀", name: "Ciencia Ficción" },
              { emoji: "😱", name: "Thriller" },
              { emoji: "📚", name: "Clásicos" },
              { emoji: "🌱", name: "Desarrollo Personal" },
              { emoji: "✨", name: "Juvenil" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href="/catalogo"
                className="card-hover bg-[var(--color-cream)] border border-gray-200 rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-2">{cat.emoji}</div>
                <div className="font-medium text-[var(--color-primary)]">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-4">
            ¿Quieres ver más?
          </h2>
          <p className="text-gray-600 mb-8">
            Visita nuestro Instagram para ver unboxings, reseñas y más sorpresas.
          </p>
          <a
            href="https://www.instagram.com/chapter21vm/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-lg inline-block"
          >
            Visitar @chapter21vm
          </a>
        </div>
      </section>
    </>
  );
}

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card-hover bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)] text-[var(--color-gold)] mb-4">
        {icon}
      </div>
      <div className="text-sm font-bold text-[var(--color-accent)] mb-2">Paso {step}</div>
      <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
