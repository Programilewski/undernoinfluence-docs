import { useState, useMemo } from "react";

const CATEGORIES = [
  { key: "beer", label: "Piwo 0%", icon: "🍺" },
  { key: "wine", label: "Wino", icon: "🍷" },
  { key: "spirits", label: "Spirytusy 0%", icon: "🥃" },
  { key: "cocktails", label: "Mocktaile", icon: "🍹" },
  { key: "cider", label: "Cydr", icon: "🍏" },
  { key: "sparkling", label: "Musujące", icon: "✨" },
];

const RARITY_DATA = {
  beer: {
    "Lech Free": 0.72, "Peroni 0.0": 0.58, "Heineken 0.0": 0.65,
    "Żywiec 0.0": 0.55, "Tyskie 0.0": 0.48, "Carlsberg 0.0": 0.42,
    "Guinness 0.0": 0.08, "BrewDog Punk AF": 0.06, "Paulaner 0.0": 0.11,
    "Erdinger Alkoholfrei": 0.09, "Brooklyn Special Effects": 0.04,
    "Clausthaler Original": 0.12,
    "Bavaria 0.0": 0.38, "Becks Blue": 0.32, "Bitburger Drive": 0.14,
    "Warsteiner Fresh": 0.07, "Krombacher 0.0": 0.05,
    "Jever Fun": 0.03, "Mikkeller Drink'in": 0.04,
  },
  wine: {
    "Oddbird Blanc": 0.15, "Leitz Eins Zwei Zero": 0.07,
    "Torres Natureo": 0.22, "Carl Jung Riesling": 0.10,
    "Pierre Zéro Rouge": 0.05,
  },
  spirits: {
    "Lyre's Dry London": 0.12, "Seedlip Garden": 0.09,
    "Monday Gin": 0.04, "Stryyk Not Vodka": 0.06,
  },
  cocktails: {
    "Virgin Mojito": 0.70, "Shirley Temple": 0.55,
    "Nojito": 0.30, "Cucumber Spritz": 0.08,
    "Lavender Fizz": 0.05, "Smoke & Mirrors": 0.03,
  },
  cider: {
    "Sapcider 0.0": 0.18, "Kopparberg AF": 0.12,
    "Old Mout AF": 0.06,
  },
  sparkling: {
    "Fever-Tree Tonic": 0.60, "Schweppes Tonic": 0.55,
    "Thomas Henry Tonic": 0.15, "Three Cents Tonic": 0.08,
  },
};

const VENUES = [
  {
    id: 1, name: "Bar Mleczny Nowoczesny", daysAgo: 5,
    products: {
      beer: ["Lech Free", "Peroni 0.0", "Heineken 0.0", "Żywiec 0.0", "Tyskie 0.0", "Carlsberg 0.0"],
      wine: ["Torres Natureo"],
      spirits: [],
      cocktails: ["Virgin Mojito", "Shirley Temple"],
      cider: [],
      sparkling: ["Fever-Tree Tonic", "Schweppes Tonic"],
    },
  },
  {
    id: 2, name: "Craft & Cork", daysAgo: 12,
    products: {
      beer: ["Guinness 0.0", "BrewDog Punk AF", "Paulaner 0.0", "Erdinger Alkoholfrei", "Brooklyn Special Effects", "Clausthaler Original"],
      wine: ["Oddbird Blanc", "Leitz Eins Zwei Zero"],
      spirits: ["Seedlip Garden", "Lyre's Dry London"],
      cocktails: ["Cucumber Spritz", "Lavender Fizz", "Smoke & Mirrors"],
      cider: ["Kopparberg AF", "Old Mout AF"],
      sparkling: ["Thomas Henry Tonic", "Three Cents Tonic"],
    },
  },
  {
    id: 3, name: "Pijalnia Wódki i Piwa", daysAgo: 95,
    products: {
      beer: ["Lech Free", "Heineken 0.0", "Żywiec 0.0"],
      wine: [],
      spirits: [],
      cocktails: ["Virgin Mojito"],
      cider: [],
      sparkling: ["Schweppes Tonic"],
    },
  },
  {
    id: 4, name: "NoLo Lounge", daysAgo: 2,
    products: {
      beer: ["Guinness 0.0", "BrewDog Punk AF", "Lech Free"],
      wine: ["Oddbird Blanc", "Leitz Eins Zwei Zero", "Carl Jung Riesling", "Pierre Zéro Rouge"],
      spirits: ["Lyre's Dry London", "Seedlip Garden", "Monday Gin", "Stryyk Not Vodka"],
      cocktails: ["Nojito", "Cucumber Spritz", "Lavender Fizz", "Smoke & Mirrors", "Virgin Mojito", "Shirley Temple"],
      cider: ["Sapcider 0.0", "Kopparberg AF", "Old Mout AF"],
      sparkling: ["Fever-Tree Tonic", "Thomas Henry Tonic", "Three Cents Tonic"],
    },
  },
  {
    id: 5, name: "Sąsiedzi Resto", daysAgo: 45,
    products: {
      beer: ["Lech Free", "Peroni 0.0", "Heineken 0.0", "Żywiec 0.0", "Tyskie 0.0", "Carlsberg 0.0"],
      wine: ["Torres Natureo"],
      spirits: [],
      cocktails: ["Virgin Mojito"],
      cider: [],
      sparkling: ["Fever-Tree Tonic"],
    },
  },
  {
    id: 6, name: "Koneser Bar", daysAgo: 8,
    products: {
      beer: ["Guinness 0.0", "BrewDog Punk AF", "Brooklyn Special Effects", "Erdinger Alkoholfrei"],
      wine: ["Leitz Eins Zwei Zero", "Pierre Zéro Rouge"],
      spirits: ["Monday Gin"],
      cocktails: ["Smoke & Mirrors"],
      cider: ["Old Mout AF"],
      sparkling: ["Three Cents Tonic"],
    },
  },
  {
    id: 7, name: "Bistro Centrum", daysAgo: 67,
    products: {
      beer: ["Lech Free", "Peroni 0.0", "Heineken 0.0", "Żywiec 0.0"],
      wine: ["Torres Natureo", "Oddbird Blanc"],
      spirits: ["Lyre's Dry London"],
      cocktails: ["Virgin Mojito"],
      cider: ["Sapcider 0.0"],
      sparkling: ["Fever-Tree Tonic"],
    },
  },
  {
    id: 8, name: "Złoty Kran", daysAgo: 120,
    products: {
      beer: ["Lech Free", "Heineken 0.0", "Peroni 0.0", "Carlsberg 0.0"],
      wine: ["Torres Natureo"],
      spirits: [],
      cocktails: ["Virgin Mojito", "Shirley Temple"],
      cider: [],
      sparkling: ["Schweppes Tonic", "Fever-Tree Tonic"],
    },
  },
  {
    id: 9, name: "Alchemik NoLo", daysAgo: 22,
    products: {
      beer: ["Brooklyn Special Effects", "Erdinger Alkoholfrei", "Clausthaler Original", "Paulaner 0.0"],
      wine: ["Carl Jung Riesling"],
      spirits: ["Stryyk Not Vodka"],
      cocktails: ["Lavender Fizz", "Cucumber Spritz"],
      cider: ["Old Mout AF"],
      sparkling: ["Three Cents Tonic"],
    },
  },
  {
    id: 10, name: "Piwoteka Zero", daysAgo: 3,
    products: {
      beer: ["Lech Free", "Peroni 0.0", "Heineken 0.0", "Żywiec 0.0", "Tyskie 0.0", "Carlsberg 0.0", "Guinness 0.0", "BrewDog Punk AF", "Paulaner 0.0", "Erdinger Alkoholfrei", "Brooklyn Special Effects", "Clausthaler Original", "Bavaria 0.0", "Becks Blue", "Bitburger Drive", "Warsteiner Fresh", "Krombacher 0.0", "Jever Fun", "Mikkeller Drink'in"],
      wine: ["Oddbird Blanc", "Leitz Eins Zwei Zero", "Torres Natureo"],
      spirits: ["Lyre's Dry London", "Seedlip Garden"],
      cocktails: ["Virgin Mojito", "Nojito", "Cucumber Spritz"],
      cider: ["Sapcider 0.0", "Kopparberg AF"],
      sparkling: ["Fever-Tree Tonic", "Thomas Henry Tonic", "Three Cents Tonic"],
    },
  },
];

function getFreshness(daysAgo) {
  if (daysAgo <= 30) return {
    label: daysAgo <= 1 ? "Zaktualizowano dziś" : `Zaktualizowano ${daysAgo} dni temu`,
    color: "#4ADE80",
    bgColor: "rgba(74, 222, 128, 0.1)",
    borderColor: "rgba(74, 222, 128, 0.2)",
    status: "fresh",
  };
  if (daysAgo <= 90) return {
    label: `Zaktualizowano ${daysAgo} dni temu`,
    color: "#FBBF24",
    bgColor: "rgba(251, 191, 36, 0.1)",
    borderColor: "rgba(251, 191, 36, 0.2)",
    status: "aging",
  };
  const months = Math.floor(daysAgo / 30);
  return {
    label: `Zaktualizowano ${months} mies. temu`,
    color: "#F87171",
    bgColor: "rgba(248, 113, 113, 0.1)",
    borderColor: "rgba(248, 113, 113, 0.2)",
    status: "stale",
  };
}

function getRarityScore(category, productName) {
  const freq = RARITY_DATA[category]?.[productName] ?? 0.5;
  const raw = 1 / freq;
  return Math.min(raw, 3);
}

function computeScores(venue) {
  let totalBreadth = 0;
  let totalRarity = 0;
  let categoriesUsed = 0;
  const perCategory = {};

  for (const cat of CATEGORIES) {
    const prods = venue.products[cat.key] || [];
    const breadth = prods.length;
    const rarity = prods.reduce((sum, p) => sum + getRarityScore(cat.key, p), 0);
    perCategory[cat.key] = { breadth, rarity, products: prods };
    totalBreadth += breadth;
    totalRarity += rarity;
    if (breadth > 0) categoriesUsed++;
  }

  return { totalBreadth, totalRarity, categoriesUsed, perCategory };
}

function Chunk({ isRare, product, delay }) {
  return (
    <div
      title={product}
      style={{
        width: 22,
        height: 22,
        borderRadius: 4,
        background: isRare
          ? "linear-gradient(135deg, #C4856B, #d4a088)"
          : "rgba(196, 133, 107, 0.25)",
        border: isRare ? "1px solid #C4856B" : "1px solid rgba(196, 133, 107, 0.2)",
        cursor: "default",
        transition: "all 0.3s ease",
        animationName: "chunkIn",
        animationDuration: "0.4s",
        animationTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        animationFillMode: "both",
        animationDelay: `${delay}ms`,
        boxShadow: isRare ? "0 0 8px rgba(196, 133, 107, 0.4)" : "none",
      }}
    />
  );
}

const MAX_VISIBLE_CHUNKS = 8;

function CategoryRow({ catInfo, catMeta, showRarity }) {
  const { breadth, products } = catInfo;

  const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    if (!showRarity) return [...products];
    return [...products].sort((a, b) => {
      const freqA = RARITY_DATA[catMeta.key]?.[a] ?? 0.5;
      const freqB = RARITY_DATA[catMeta.key]?.[b] ?? 0.5;
      return freqA - freqB;
    });
  }, [products, showRarity, catMeta.key]);

  if (breadth === 0) return null;

  const visible = sortedProducts.slice(0, MAX_VISIBLE_CHUNKS);
  const overflow = breadth - visible.length;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{catMeta.icon}</span>
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
        {visible.map((p, i) => {
          const freq = RARITY_DATA[catMeta.key]?.[p] ?? 0.5;
          const isRare = showRarity && freq < 0.15;
          return <Chunk key={p} product={p} isRare={isRare} delay={i * 40} />;
        })}
        {overflow > 0 && (
          <span
            title={sortedProducts.slice(MAX_VISIBLE_CHUNKS).join(", ")}
            style={{
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
              fontWeight: 500,
              color: "#C4856B",
              background: "rgba(196, 133, 107, 0.12)",
              border: "1px solid rgba(196, 133, 107, 0.15)",
              borderRadius: 4,
              padding: "3px 6px",
              marginLeft: 2,
              cursor: "default",
              whiteSpace: "nowrap",
            }}
          >
            +{overflow}
          </span>
        )}
      </div>
      <span style={{
        fontSize: 11,
        color: "rgba(196, 133, 107, 0.5)",
        fontFamily: "'DM Mono', monospace",
        marginLeft: 4,
        whiteSpace: "nowrap",
      }}>
        {breadth}
      </span>
    </div>
  );
}

function VenueCard({ venue, scores, rank, showRarity, isVersion2 }) {
  const freshness = getFreshness(venue.daysAgo);
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(196, 133, 107, 0.12)",
      borderRadius: 12,
      padding: "16px 18px",
      marginBottom: 10,
      transition: "all 0.4s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: "#0D0F14",
            background: "#C4856B",
            width: 22,
            height: 22,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
          }}>
            {rank}
          </span>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: 15,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              color: "#e8ddd4",
              letterSpacing: "-0.02em",
            }}>
              {venue.name}
            </h3>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              marginTop: 4,
              padding: "2px 7px",
              borderRadius: 4,
              background: freshness.bgColor,
              border: `1px solid ${freshness.borderColor}`,
            }}>
              <span style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: freshness.color,
                boxShadow: freshness.status === "fresh" ? `0 0 6px ${freshness.color}` : "none",
              }} />
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9,
                color: freshness.color,
                letterSpacing: "0.02em",
              }}>
                {freshness.label}
              </span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 18,
            color: "#C4856B",
            fontWeight: 700,
            lineHeight: 1,
          }}>
            {scores.totalBreadth}
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            color: "rgba(196, 133, 107, 0.4)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginTop: 2,
          }}>
            produktów
          </div>
        </div>
      </div>

      {CATEGORIES.map(cat => (
        <CategoryRow
          key={cat.key}
          catInfo={scores.perCategory[cat.key]}
          catMeta={cat}
          showRarity={showRarity}
        />
      ))}

      <div style={{
        display: "flex",
        gap: 12,
        marginTop: 10,
        paddingTop: 10,
        borderTop: "1px solid rgba(196, 133, 107, 0.08)",
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "rgba(196, 133, 107, 0.4)",
        }}>
          {scores.categoriesUsed}/{CATEGORIES.length} kategorii
        </div>
        {isVersion2 && (
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: "rgba(196, 133, 107, 0.3)",
          }}>
            rarity: {scores.totalRarity.toFixed(1)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function UNIScoringDemo() {
  const [version, setVersion] = useState("v1");
  const isV2 = version === "v2";

  const sortedVenues = useMemo(() => {
    const scored = VENUES.map(v => ({ venue: v, scores: computeScores(v) }));

    scored.sort((a, b) => {
      const breadthDiff = b.scores.totalBreadth - a.scores.totalBreadth;
      if (breadthDiff !== 0) return breadthDiff;
      if (isV2) return b.scores.totalRarity - a.scores.totalRarity;
      return 0;
    });

    return scored;
  }, [version]);

  const tiebreakerActive = isV2 && sortedVenues.some((v, i) =>
    i > 0 && v.scores.totalBreadth === sortedVenues[i - 1].scores.totalBreadth
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D0F14",
      color: "#e8ddd4",
      fontFamily: "'DM Sans', sans-serif",
      padding: "24px 16px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap');
        @keyframes chunkIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 22,
            fontWeight: 800,
            margin: 0,
            letterSpacing: "-0.03em",
            color: "#C4856B",
          }}>
            UNI Scoring
          </h1>
          <p style={{
            fontSize: 12,
            color: "rgba(232, 221, 212, 0.4)",
            margin: "6px 0 0",
            lineHeight: 1.5,
          }}>
            Interaktywna wizualizacja systemu scoringu oferty NoLo
          </p>
        </div>

        {/* Version Toggle */}
        <div style={{
          display: "flex",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 10,
          padding: 3,
          marginBottom: 8,
          border: "1px solid rgba(196, 133, 107, 0.1)",
        }}>
          {["v1", "v2"].map(v => (
            <button
              key={v}
              onClick={() => setVersion(v)}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.04em",
                transition: "all 0.25s ease",
                background: version === v ? "#C4856B" : "transparent",
                color: version === v ? "#0D0F14" : "rgba(196, 133, 107, 0.5)",
              }}
            >
              {v === "v1" ? "V1 — Breadth" : "V2 — Breadth + Rarity"}
            </button>
          ))}
        </div>

        {/* Version description */}
        <div style={{
          padding: "10px 14px",
          marginBottom: 20,
          borderRadius: 8,
          background: "rgba(196, 133, 107, 0.06)",
          border: "1px solid rgba(196, 133, 107, 0.08)",
        }}>
          <p style={{
            margin: 0,
            fontSize: 11,
            lineHeight: 1.6,
            color: "rgba(232, 221, 212, 0.5)",
          }}>
            {isV2
              ? "Sortowanie: breadth count (1. klucz) → rarity score jako tiebreaker (2. klucz). Podświetlone chunki = produkty rzadkie (<15% venue). Venue z większą ilością produktów jest ZAWSZE wyżej."
              : "Sortowanie wyłącznie po ilości produktów NoLo (per kategoria, liniowo). Każdy chunk = jeden realny produkt z zamkniętego katalogu UNI."
            }
          </p>
        </div>

        {/* Legend */}
        <div style={{
          display: "flex",
          gap: 16,
          marginBottom: 16,
          padding: "0 4px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 14, height: 14, borderRadius: 3,
              background: "rgba(196, 133, 107, 0.25)",
              border: "1px solid rgba(196, 133, 107, 0.2)",
            }} />
            <span style={{ fontSize: 10, color: "rgba(232,221,212,0.4)", fontFamily: "'DM Mono', monospace" }}>
              standard
            </span>
          </div>
          {isV2 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 14, height: 14, borderRadius: 3,
                background: "linear-gradient(135deg, #C4856B, #d4a088)",
                border: "1px solid #C4856B",
                boxShadow: "0 0 6px rgba(196, 133, 107, 0.4)",
              }} />
              <span style={{ fontSize: 10, color: "rgba(232,221,212,0.4)", fontFamily: "'DM Mono', monospace" }}>
                rzadki (&lt;15% venue)
              </span>
            </div>
          )}
        </div>

        {/* Freshness Legend */}
        <div style={{
          display: "flex",
          gap: 12,
          marginBottom: 16,
          padding: "0 4px",
        }}>
          {[
            { color: "#4ADE80", label: "< 30 dni" },
            { color: "#FBBF24", label: "30–90 dni" },
            { color: "#F87171", label: "90+ dni" },
          ].map(f => (
            <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: f.color,
              }} />
              <span style={{ fontSize: 9, color: "rgba(232,221,212,0.35)", fontFamily: "'DM Mono', monospace" }}>
                {f.label}
              </span>
            </div>
          ))}
        </div>

        {/* Tiebreaker notice */}
        {tiebreakerActive && (
          <div style={{
            padding: "8px 12px",
            marginBottom: 14,
            borderRadius: 6,
            borderLeft: "3px solid #C4856B",
            background: "rgba(196, 133, 107, 0.08)",
          }}>
            <p style={{
              margin: 0,
              fontSize: 10,
              color: "#C4856B",
              fontFamily: "'DM Mono', monospace",
              lineHeight: 1.5,
            }}>
              ⚡ Rarity tiebreaker aktywny — venue z tym samym breadth posortowane wg rzadkości produktów
            </p>
          </div>
        )}

        {/* Venue cards */}
        {sortedVenues.map(({ venue, scores }, i) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            scores={scores}
            rank={i + 1}
            showRarity={isV2}
            isVersion2={isV2}
          />
        ))}

        {/* Footer note */}
        <div style={{
          marginTop: 20,
          padding: "12px 14px",
          borderRadius: 8,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(196, 133, 107, 0.06)",
        }}>
          <p style={{
            margin: 0,
            fontSize: 10,
            color: "rgba(232, 221, 212, 0.3)",
            lineHeight: 1.6,
            fontFamily: "'DM Mono', monospace",
          }}>
            {isV2
              ? "Przełącz na V1 żeby zobaczyć jak sortowanie wygląda bez rarity. Zauważ pary z tym samym breadth: Koneser vs Bistro vs Alchemik (po 10) i Bar Mleczny vs Sąsiedzi vs Złoty Kran (po 9–11). Rarity rozstrzyga remisy."
              : "Przełącz na V2 żeby zobaczyć jak rarity tiebreaker rozstrzyga remisy. Porównaj venue z identyczną ilością produktów — kto ma rzadsze, ten wygrywa pozycję."
            }
          </p>
        </div>
      </div>
    </div>
  );
}
