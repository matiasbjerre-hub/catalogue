// Party.Rent Denmark — shared components & helpers
const { useState, useEffect, useMemo, useRef, createContext, useContext } = React;

// ─── Icons ─────────────────────────────────────────────────────────────────
const Icon = {
  Plus: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14" /></svg>,
  Check: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12.5l4.5 4.5L19 7" /></svg>,
  X: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>,
  Search: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>,
  Cart: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 3h2l3 13h11l2-8H6" /><circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" /></svg>,
  Arrow: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  Tag: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 12L12 4H4v8l8 8 8-8z" /><circle cx="8" cy="8" r="1.5" fill="currentColor" /></svg>
};

// ─── Format helpers ────────────────────────────────────────────────────────
function fmtPrice(value, locale) {
  if (value == null) return null;
  // Always DKK regardless of language, with locale-appropriate separators
  try {
    return new Intl.NumberFormat(locale, {
      style: "decimal", minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(value);
  } catch {
    return String(value);
  }
}

// Determine if a tint is "light" (needs dark text on top)
function isLightTint(tintKey) {
  return ["ivory", "linen", "stone", "chrome", "peach", "pink"].includes(tintKey);
}

// ─── Product card media — real pack shot with silhouette fallback ─────────
function ProductMedia({ product, large = false }) {
  const shape = useMemo(() => silhouetteFor(product), [product.id]);
  const photo = useMemo(() => window.packshotFor ? window.packshotFor(product) : null, [product.id]);
  const [failed, setFailed] = useState(false);
  return (
    <div className="card__media">
      <div className="card__art">{product.art}</div>
      {photo && !failed ?
      <img className="card__photo" src={photo} alt={product.name}
      loading="lazy" onError={() => setFailed(true)} /> :

      <svg viewBox="0 0 200 200" className="card__media-svg" preserveAspectRatio="xMidYMid meet">
          {shape("rgba(22,20,15,0.72)")}
        </svg>
      }
    </div>);

}

// Generates a deterministic vague silhouette so cards have varied geometry
function silhouetteFor(product) {
  const cat = product.cat;
  const sub = product.sub;
  if (cat === "chairs" && sub === "bar") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <rect x="78" y="60" width="44" height="40" rx="6" />
      <line x1="100" y1="100" x2="100" y2="160" />
      <line x1="80" y1="160" x2="120" y2="160" />
      <line x1="86" y1="130" x2="114" y2="130" />
    </g>;
  }
  if (cat === "chairs") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <path d="M70 60 Q70 50 80 50 H120 Q130 50 130 60 V110 H70 Z" />
      <line x1="78" y1="110" x2="78" y2="160" />
      <line x1="122" y1="110" x2="122" y2="160" />
    </g>;
  }
  if (cat === "tables" && sub === "high") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <line x1="50" y1="60" x2="150" y2="60" />
      <line x1="100" y1="60" x2="100" y2="150" />
      <ellipse cx="100" cy="155" rx="34" ry="6" />
    </g>;
  }
  if (cat === "tables" && sub === "dinner") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <ellipse cx="100" cy="80" rx="60" ry="12" />
      <line x1="50" y1="84" x2="50" y2="150" />
      <line x1="150" y1="84" x2="150" y2="150" />
    </g>;
  }
  if (cat === "tables") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <rect x="50" y="80" width="100" height="14" rx="2" />
      <line x1="60" y1="94" x2="60" y2="140" />
      <line x1="140" y1="94" x2="140" y2="140" />
    </g>;
  }
  if (cat === "lounge" && sub === "sofas") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M40 100 V70 Q40 60 50 60 H150 Q160 60 160 70 V100 H40 Z" />
      <line x1="40" y1="110" x2="160" y2="110" />
      <line x1="50" y1="110" x2="50" y2="140" />
      <line x1="150" y1="110" x2="150" y2="140" />
    </g>;
  }
  if (cat === "lounge" && sub === "poufs") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <ellipse cx="100" cy="110" rx="50" ry="20" />
      <path d="M50 110 V120 Q50 135 100 135 Q150 135 150 120 V110" />
    </g>;
  }
  if (cat === "lounge") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <path d="M50 90 Q50 60 80 60 H120 Q150 60 150 90 V120 H50 Z" />
      <line x1="60" y1="120" x2="60" y2="150" />
      <line x1="140" y1="120" x2="140" y2="150" />
    </g>;
  }
  if (cat === "bars") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <rect x="40" y="60" width="120" height="100" rx="3" />
      <line x1="40" y1="90" x2="160" y2="90" />
      <line x1="100" y1="90" x2="100" y2="160" />
    </g>;
  }
  if (cat === "shelving") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <rect x="55" y="40" width="90" height="130" rx="2" />
      <line x1="55" y1="70" x2="145" y2="70" />
      <line x1="55" y1="100" x2="145" y2="100" />
      <line x1="55" y1="130" x2="145" y2="130" />
    </g>;
  }
  if (cat === "carpets") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <rect x="40" y="60" width="120" height="80" rx="2" />
      <line x1="40" y1="80" x2="160" y2="80" />
      <line x1="40" y1="120" x2="160" y2="120" />
    </g>;
  }
  if (cat === "lighting") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <path d="M85 50 Q85 40 100 40 Q115 40 115 50 V80 H85 Z" />
      <line x1="100" y1="80" x2="100" y2="150" />
      <ellipse cx="100" cy="155" rx="22" ry="5" />
    </g>;
  }
  if (cat === "plants") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <path d="M100 130 Q70 100 70 70 Q100 80 100 130 Z" />
      <path d="M100 130 Q130 100 130 70 Q100 80 100 130 Z" />
      <path d="M85 150 L115 150 L110 170 L90 170 Z" />
    </g>;
  }
  if (cat === "tableware" && sub === "glasses") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <path d="M85 50 Q85 90 100 100 Q115 90 115 50 Z" />
      <line x1="100" y1="100" x2="100" y2="150" />
      <line x1="85" y1="155" x2="115" y2="155" />
    </g>;
  }
  if (cat === "tableware" && sub === "cutlery") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <line x1="100" y1="40" x2="100" y2="160" />
      <path d="M90 40 V70 M100 40 V70 M110 40 V70" />
    </g>;
  }
  if (cat === "tableware") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <ellipse cx="100" cy="100" rx="55" ry="50" />
      <ellipse cx="100" cy="100" rx="38" ry="34" />
    </g>;
  }
  if (cat === "kitchen") {
    return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
      <rect x="55" y="50" width="90" height="110" rx="3" />
      <circle cx="100" cy="100" r="22" />
      <line x1="55" y1="80" x2="145" y2="80" />
    </g>;
  }
  // misc default
  return (c) => <g fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
    <rect x="55" y="55" width="90" height="90" rx="6" />
    <line x1="55" y1="100" x2="145" y2="100" />
  </g>;
}

// ─── Brand / Logo mark ─────────────────────────────────────────────────────
function BrandLogo({ variant }) {
  return (
    <div className="brand" data-variant={variant || "dark"}>
      <img src={window.__resources && window.__resources.logo_rg || "assets/rent-group-logo.png"} alt="Rent.Group" className="brand__img" style={{ height: "190px" }} />
    </div>);

}

// ─── Category icons (line-art) ────────────────────────────────────────────
const CategoryIcon = {
  chairs: (p) => <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M22 14 H42 V40 H22 Z" /><path d="M22 14 V8 H42 V14" /><path d="M22 40 V54" /><path d="M42 40 V54" /><path d="M19 54 H45" />
  </svg>,
  tables: (p) => <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="8" y="22" width="48" height="6" /><path d="M14 28 V52" /><path d="M50 28 V52" />
  </svg>,
  lounge: (p) => <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M10 36 V26 Q10 20 16 20 H48 Q54 20 54 26 V36" /><rect x="6" y="36" width="52" height="12" /><path d="M10 48 V54" /><path d="M54 48 V54" />
  </svg>,
  bars: (p) => <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="10" y="14" width="44" height="40" /><path d="M10 26 H54" /><path d="M32 26 V54" />
  </svg>,
  shelving: (p) => <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="14" y="8" width="36" height="48" /><path d="M14 22 H50" /><path d="M14 36 H50" /><path d="M14 50 H50" />
  </svg>,
  carpets: (p) => <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="8" y="18" width="48" height="28" /><path d="M8 26 H56" /><path d="M8 38 H56" /><path d="M4 14 L8 18" /><path d="M60 14 L56 18" /><path d="M4 50 L8 46" /><path d="M60 50 L56 46" />
  </svg>,
  lighting: (p) => <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M32 8 V14" /><path d="M22 28 H42 L36 14 H28 Z" /><path d="M32 28 V46" /><ellipse cx="32" cy="48" rx="10" ry="3" />
  </svg>,
  plants: (p) => <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M32 42 Q22 32 22 18 Q32 22 32 42" /><path d="M32 42 Q42 32 42 18 Q32 22 32 42" /><path d="M24 42 H40 L38 54 H26 Z" />
  </svg>,
  tableware: (p) => <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="32" cy="32" r="22" /><circle cx="32" cy="32" r="14" />
  </svg>,
  kitchen: (p) => <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="12" y="10" width="40" height="44" /><circle cx="32" cy="36" r="10" /><path d="M12 22 H52" />
  </svg>,
  misc: (p) => <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="32" cy="32" r="22" /><path d="M24 28 H40" /><path d="M24 36 H40" />
  </svg>
};

// ─── i18n context ──────────────────────────────────────────────────────────
const I18nCtx = createContext({ t: window.I18N.da, lang: "da", setLang: () => {} });
const useI18n = () => useContext(I18nCtx);

Object.assign(window, {
  Icon, ProductMedia, BrandLogo, CategoryIcon, fmtPrice, isLightTint,
  silhouetteFor,
  I18nCtx, useI18n
});