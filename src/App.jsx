import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Sparkles, Wand2, Mail, Trash2, Star } from "lucide-react";

// --- Helper: currency
const fmt = (n) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
    n
  );

// --- Kategorien
const CATEGORIES = [
  { id: "candles", label: "Ritualkerzen", icon: <Sparkles className="w-4 h-4" /> },
  { id: "jars", label: "Spell Jars", icon: <Star className="w-4 h-4" /> },
  { id: "readings", label: "Kartenlegungen", icon: <Wand2 className="w-4 h-4" /> },
];

// --- Produkte
const PRODUCTS = [
  {
    id: "liebeslegung-5",
    category: "readings",
    name: "Ausführliche Liebeslegung – 5 Fragen",
    price: 39.0,
    image: "/images/Liebeslegung.png",
    description:
      "Eine liebevolle Deutung deiner Herzensfragen. Ob Beziehung, Affäre oder Single – du bekommst klare Antworten zu bis zu 5 Fragen rund um Liebe und Gefühle.",
  },
  {
    id: "drei-monate",
    category: "readings",
    name: "3-Monats-Legung – Dein Blick in die nahe Zukunft",
    price: 29.0,
    image: "/images/DreiMonateslegung.png",
    description:
      "Ein Ausblick auf die nächsten Wochen und Monate. Die Karten zeigen dir, welche Energien wirken, welche Chancen sich zeigen und worauf du achten darfst.",
  },
  {
    id: "fragen-1-3",
    category: "readings",
    name: "1–3 Fragen – Deine klare Antwort",
    price: 19.0,
    image: "/images/1-3fragen.png",
    description:
      "Stelle bis zu 3 persönliche Fragen und erhalte schnelle, klare Impulse zu Liebe, Beruf, Finanzen oder einem anderen Thema, das dir am Herzen liegt.",
  },
  {
    id: "liebeslegung-singles",
    category: "readings",
    name: "Liebeslegung für Singles",
    price: 34.0,
    image: "/images/liebelegungSingles.png",
    description:
      "Dein Weg in die Liebe: Chancen, Blockaden und Hinweise, die dir helfen, dich zu öffnen und neue Liebe in dein Leben einzuladen.",
  },
  {
    id: "botschaft-universum",
    category: "readings",
    name: "Botschaft des Universums",
    price: 24.0,
    image: "/images/BotschaftdesUniversums.png",
    description:
      "Wenn du keine konkrete Frage hast: Die Karten geben dir eine präzise, liebevolle Botschaft zu deiner aktuellen Situation und deinen Energien.",
  },
  {
    id: "jahreslegung-12m",
    category: "readings",
    name: "Jahreslegung – Deine nächsten 12 Monate",
    price: 49.0,
    image: "/images/Jahreslegung.png",
    description:
      "Eine detaillierte Vorschau auf 12 Monate. Du erfährst, welche Energien dich begleiten und worauf du achten darfst – liebevoll und klar geschrieben.",
  },
  {
    id: "mini-botschaft",
    category: "readings",
    name: "Tarot Mini-Botschaft – 3 Worte & 1 Satz",
    price: 14.0,
    image: "/images/Tarotminibotschaft.png",
    description:
      "Kurze, klare Inspiration: 3 Worte und 1 Satz aus den Karten, die dir zeigen, was gerade wirklich wichtig ist.",
  },
  {
    id: "beruf-finanzen",
    category: "readings",
    name: "Beruf & Finanzen – Klarheit für deine Zukunft",
    price: 34.0,
    image: "/images/Beruf&Finanzen.png",
    description:
      "Ein klarer Blick auf deine Karriere und finanzielle Entwicklung. Die Karten zeigen Chancen, Risiken und wie du deine Ziele erreichen kannst.",
  },
  {
    id: "gedanken-gefuehle",
    category: "readings",
    name: "Was denkt er/sie über dich?",
    price: 29.0,
    image: "/images/Wasdenkter.png",
    description:
      "Finde heraus, was er oder sie wirklich über dich denkt und fühlt. Eine ehrliche Kartenlegung, die dir hilft, Klarheit zu gewinnen.",
  },
  {
    id: "monatsbotschaft",
    category: "readings",
    name: "Deine Monatsbotschaft",
    price: 24.0,
    image: "/images/DeinNachstermonat.png",
    description:
      "Jeder Monat bringt neue Chancen. Die Karten zeigen dir Impulse und Hinweise, worauf du dich einstellen darfst.",
  },
  {
    id: "entscheidungshilfe",
    category: "readings",
    name: "Entscheidungshilfe – Finde Klarheit",
    price: 29.0,
    image: "/images/Entscheidungshilfe.png",
    description:
      "Wenn du zwischen zwei Wegen stehst: Diese Kartenlegung zeigt dir Chancen, Stolpersteine und einen klaren Impuls für deine Entscheidung.",
  },
  {
    id: "seelenimpuls",
    category: "readings",
    name: "Seelenimpuls – Heilung & innere Stärke",
    price: 24.0,
    image: "/images/Seelenimpuls.png",
    description:
      "Eine sanfte Botschaft, die dir zeigt, was deiner Seele gerade guttut und wie du deinen Heilungsweg liebevoll unterstützen kannst.",
  },
  {
    id: "warum-kein-kontakt",
    category: "readings",
    name: "Wieso meldet er sich nicht?",
    price: 29.0,
    image: "/images/wiesomeldetersichnicht.png",
    description:
      "Bei Funkstille und Rückzug: Die Karten zeigen, was wirklich dahintersteckt und ob sich Hoffnungen lohnen oder es Zeit ist, loszulassen.",
  },
];

// --- Fallback für bunte Hintergründe
function GradientImage({ color }) {
  return (
    <div
      className={`w-full h-40 rounded-xl bg-gradient-to-br ${color} shadow-inner`}
    />
  );
}

export default function ShopStarter() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [cart, setCart] = useState({});
  const [note, setNote] = useState("");

  const filtered = useMemo(() => {
    return PRODUCTS.filter(
      (p) =>
        (cat === "all" || p.category === cat) &&
        p.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, cat]);

  const items = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const p = PRODUCTS.find((x) => x.id === id);
        return { ...p, qty, sum: (p?.price || 0) * qty };
      })
      .filter(Boolean);
  }, [cart]);

  const total = items.reduce((a, b) => a + b.sum, 0);

  const add = (id) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const sub = (id) =>
    setCart((prev) => {
      const next = { ...prev };
      if (!next[id]) return next;
      if (next[id] === 1) delete next[id];
      else next[id] -= 1;
      return next;
    });
  const remove = (id) =>
    setCart((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
  const clear = () => setCart({});

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent("Sugar & Spell – Anfrage Bestellung");
    const bodyLines = [
      "Hallo Bianca,",
      "ich möchte gern bestellen:",
      ...items.map((it) => `• ${it.name} × ${it.qty} = ${fmt(it.sum)}`),
      "",
      `Zwischensumme: ${fmt(total)}`,
      note ? "" : "",
      note ? `Hinweis: ${note}` : "",
    ].join("\n");
    return `mailto:sugarandspell@gmail.com?subject=${subject}&body=${encodeURIComponent(
      bodyLines
    )}`;
  }, [items, total, note]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-amber-50 to-white text-stone-800">
      <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-white/60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <span className="inline-flex h-8 w-8 rounded-xl bg-gradient-to-br from-pink-300 via-rose-300 to-amber-200 shadow" />
            <h1 className="font-semibold tracking-tight">Sugar & Spell</h1>
            <span className="text-stone-500 text-sm">
              Magie in Licht und Worten
            </span>
          </motion.div>
          <div className="ml-auto flex items-center gap-2">
            <input
              className="px-3 py-2 rounded-xl bg-white shadow-inner text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="Suche…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Kategorien */}
        <div className="flex flex-wrap gap-2 my-4">
          <CategoryPill
            active={cat === "all"}
            onClick={() => setCat("all")}
            label="Alles"
          />
          {CATEGORIES.map((c) => (
            <CategoryPill
              key={c.id}
              active={cat === c.id}
              onClick={() => setCat(c.id)}
              label={c.label}
              icon={c.icon}
            />
          ))}
        </div>

        {/* Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-28">
          {filtered.map((p, idx) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="rounded-2xl bg-white/90 shadow-sm border border-stone-200 overflow-hidden"
            >
              <div className="p-3">
                <div className="relative">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-40 rounded-xl object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <GradientImage color={p.color} />
                  )}
                </div>
                <h3 className="mt-3 font-semibold leading-tight">{p.name}</h3>
                <p className="mt-1 text-sm text-stone-600">{p.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold">{fmt(p.price)}</span>
                  <button
                    onClick={() => add(p.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-900 text-white text-sm hover:bg-stone-700 active:scale-[.98]"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    In den Warenkorb
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </section>
      </main>

      {/* Warenkorb */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(100%-1rem,64rem)]">
        <div className="rounded-2xl bg-white shadow-xl border border-stone-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-3 p-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="font-medium">Warenkorb</span>
              <span className="text-sm text-stone-500">
                {items.length} Positionen
              </span>
            </div>
            <div className="sm:ml-auto flex flex-wrap gap-2 items-center">
              <span className="font-semibold">Summe: {fmt(total)}</span>
              <a
                href={mailtoHref}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white ${
                  total > 0
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "bg-stone-300"
                }`}
                onClick={(e) => {
                  if (total === 0) {
                    e.preventDefault();
                  }
                }}
              >
                <Mail className="w-4 h-4" />
                Anfrage senden
              </a>
              <button
                onClick={clear}
                className="px-3 py-2 rounded-xl bg-stone-100 text-sm hover:bg-stone-200"
              >
                Leeren
              </button>
            </div>
          </div>
          {items.length > 0 && (
            <div className="px-3 pb-3">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="py-2 flex items-center gap-3 border-b border-stone-100"
                >
                  <div className="h-10 w-10 rounded-lg overflow-hidden">
                    {it.image ? (
                      <img
                        src={it.image}
                        alt={it.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className={`h-full w-full rounded-lg bg-gradient-to-br ${it.color}`}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {it.name}
                    </div>
                    <div className="text-xs text-stone-500">
                      {fmt(it.price)} pro Stück
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <QtyBtn onClick={() => sub(it.id)}>-</QtyBtn>
                    <span className="w-6 text-center text-sm">{it.qty}</span>
                    <QtyBtn onClick={() => add(it.id)}>+</QtyBtn>
                    <span className="w-20 text-right text-sm font-medium">
                      {fmt(it.sum)}
                    </span>
                    <button
                      onClick={() => remove(it.id)}
                      className="p-2 rounded-lg hover:bg-stone-100"
                    >
                      <Trash2 className="w-4 h-4 text-stone-500" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-2">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Hinweise zur Bestellung …"
                  className="w-full text-sm p-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryPill({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm border ${
        active
          ? "bg-stone-900 text-white border-stone-900"
          : "bg-white border-stone-200 hover:bg-stone-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function QtyBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="h-8 w-8 rounded-lg bg-stone-100 hover:bg-stone-200"
    >
      {children}
    </button>
  );
}
