// Party.Rent Denmark — main app  (Westmans-inspired clean direction)
const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA, useRef: useRefA } = React;

// ─── Tweak defaults — direct-edit persisted ───────────────────────────────
const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#C9B998",
  "showInspiration": true,
  "showShortcuts": true,
  "showQuotes": true,
  "heroAlign": "center"
} /*EDITMODE-END*/;

// ─── Root ──────────────────────────────────────────────────────────────────
function App() {
  const [lang, setLang] = useStateA(() => localStorage.getItem("pr_lang") || "da");
  useEffectA(() => {
    localStorage.setItem("pr_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  const t = window.I18N[lang];

  const [tweaks, setTweak] = useTweaks(TWEAKS_DEFAULTS);
  useEffectA(() => {
    document.documentElement.style.setProperty("--sand", tweaks.accent);
  }, [tweaks.accent]);

  return (
    <I18nCtx.Provider value={{ t, lang, setLang }}>
      <CartProvider>
        <Header />
        <Hero tweaks={tweaks} />
        {tweaks.showShortcuts && <CategoryShortcuts />}
        <Catalogue />
        {tweaks.showInspiration && <Inspiration />}
        {tweaks.showQuotes && <Testimonials />}
        <Footer />
        <CartDrawer />
        <PRTweaks tweaks={tweaks} setTweak={setTweak} />
      </CartProvider>
    </I18nCtx.Provider>);

}

// ─── RFQ modal button (Fase 5) ─────────────────────────────────────────────
const RFQ_EXEC_URL = "https://script.google.com/macros/s/AKfycbxQdgRCwMfTghCs4a8uQIfVvkODyUoof_kL7VI6LKZxQBf2floEVr_rAod2FLh1wdB1/exec?mode=web";

function RfqButton() {
  const { t } = useI18n();
  const cart = useCart();
  const [open, setOpen] = useStateA(false);
  const iframeRef = useRefA(null);

  useEffectA(() => {
    if (!open) return;
    const sendCart = () => {
      try {
        iframeRef.current.contentWindow.postMessage(
          { type: "cart", items: cart.items },
          "https://script.google.com"
        );
      } catch (err) {}
    };
    const timer = setTimeout(sendCart, 2500);
    const onMsg = (e) => {
      if (!e.data || e.data.type !== "addToCart") return;
      const items = e.data.items || [];
      items.forEach((item) => {
        if (!item.art) return;
        const prod = window.PRODUCTS.find((p) => String(p.art) === String(item.art));
        if (!prod) return;
        for (let i = 0; i < Math.max(1, item.qty || 1); i++) cart.add(prod);
      });
      setOpen(false);
    };
    window.addEventListener("message", onMsg);
    return () => { clearTimeout(timer); window.removeEventListener("message", onMsg); };
  }, [open]);

  const label = t.rfq ? t.rfq.btn : "Få møbelforslag";
  const closeLabel = t.rfq ? t.rfq.close : "Luk";

  return (
    <React.Fragment>
      <button className="rfq-btn" onClick={() => setOpen(true)}>{label}</button>
      {open && (
        <div className="rfq-overlay" onClick={() => setOpen(false)}>
          <div className="rfq-modal" onClick={(e) => e.stopPropagation()}>
            <button className="rfq-close" onClick={() => setOpen(false)} aria-label={closeLabel}>✕</button>
            <iframe ref={iframeRef} src={RFQ_EXEC_URL} className="rfq-iframe" title="RFQ Analyser" />
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

// ─── Header ────────────────────────────────────────────────────────────────
function Header() {
  const { t, lang, setLang } = useI18n();
  const { count, setOpen } = useCart();
  return (
    <header className="site-header">
      <div className="site-header__top">
        <div className="wrap">
          <div className="site-header__top-row">
            <a href="tel:+4531767671">+45 31 76 76 71 — copenhagen@rent.group</a>
            <span style={{ fontFamily: "Montserrat" }}>{t.footer.top_bar}</span>
          </div>
        </div>
      </div>
      <div className="wrap" style={{ width: "1700px", textAlign: "left" }}>
        <div className="site-header__row" style={{ textAlign: "left", fontFamily: "Montserrat", width: "1400px", padding: "0px 0px 8px" }}>
          <a href="#top" style={{ justifySelf: "start" }}><BrandLogo /></a>
          <nav className="nav">
            <a href="#catalogue" data-active="true">{t.nav.catalogue}</a>
            <a href="#inspiration">{t.nav.inspiration}</a>
            <a href="#about">{t.nav.about}</a>
            <a href="#contact">{t.nav.contact}</a>
          </nav>
          <div className="header-tools">
            <div className="lang">
              {["da", "en", "sv"].map((code) =>
              <button key={code} data-active={lang === code} onClick={() => setLang(code)}>
                  {code.toUpperCase()}
                </button>
              )}
            </div>
            <RfqButton />
            <button className="cart-btn" onClick={() => setOpen(true)}>
              {t.nav.cart}
              <span className="count">{count}</span>
            </button>
          </div>
        </div>
      </div>
    </header>);

}

// ─── Hero — looping background video ──────────────────────────────────────
const __R = (id, fallback) => window.__resources && window.__resources[id] || fallback;
const HERO_VIDEO = __R("hero_video", "https://westmans.se/wp-content/uploads/2025/12/party.rent__every_item_shared_v2_vertont-2160p_1.mp4");
const HERO_POSTER = __R("hero_poster", "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=2400&auto=format&fit=crop&q=72");

function Hero({ tweaks }) {
  const { t } = useI18n();
  return (
    <section className="hero" id="top">
      <div className="hero__stage">
        <video
          className="hero__video"
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata" />
        
        <div className="hero__gradient" aria-hidden="true"></div>

        <div className="hero__copy">
          <div className="wrap">
            <div className="hero__eyebrow">{t.hero.eyebrow}</div>
            <h1 className="hero__title display">
              {t.hero.title_a}<br />{t.hero.title_b}
            </h1>
            <div className="hero__ctas">
              <a className="btn btn-primary btn-on-dark" href="#catalogue">{t.hero.cta_browse}</a>
              <a className="btn btn-ghost btn-on-dark" href="#contact">{t.hero.cta_contact}</a>
            </div>
          </div>
        </div>

        <div className="hero__meta">
          <div className="wrap hero__meta-row">
            <div className="hero__location" style={{ fontFamily: "Montserrat" }}>{t.hero.tagline}</div>
            <a href="#catalogue" className="hero__scroll">
              <span>{t.hero.scroll}</span>
              <span className="hero__scroll-line" aria-hidden="true"></span>
            </a>
          </div>
        </div>
      </div>
    </section>);

}

// ─── Category shortcuts (icon grid like Westmans homepage) ────────────────
function CategoryShortcuts() {
  const { t } = useI18n();
  // Show the 12 most-relevant categories
  const cats = useMemoA(() => window.CATEGORIES.slice(0, 12), []);
  const onClick = (id) => {
    const el = document.querySelector('.cat-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Set active category via a small global event so Catalogue listens
    window.dispatchEvent(new CustomEvent('pr-set-cat', { detail: id }));
  };
  return (
    <section className="cat-shortcuts">
      <div className="wrap">
        <div className="cat-shortcuts__head">
          <p>{t.shortcuts.eyebrow}</p>
          <h2>{t.shortcuts.title}</h2>
        </div>
        <div className="cat-shortcuts__grid">
          {cats.map((c) => {
            const Ico = CategoryIcon[c.id] || CategoryIcon.misc;
            return (
              <button className="cat-card" key={c.id} onClick={() => onClick(c.id)}>
                <span className="cat-card__icon"><Ico /></span>
                <span className="cat-card__label">{t.cat[c.id]}</span>
              </button>);

          })}
        </div>
      </div>
    </section>);

}

// ─── Catalogue ────────────────────────────────────────────────────────────
function Catalogue() {
  const { t } = useI18n();
  const [active, setActive] = useStateA("chairs");
  const [query, setQuery] = useStateA("");

  useEffectA(() => {
    const h = (e) => setActive(e.detail);
    window.addEventListener('pr-set-cat', h);
    return () => window.removeEventListener('pr-set-cat', h);
  }, []);

  const products = useMemoA(() => {
    const q = query.trim().toLowerCase();
    // Extract a brand prefix from the product name to group same-brand items together
    const brandOf = (p) => {
      const m = p.name.match(/^([A-Za-z0-9.]+(?:\s+[A-Za-z0-9.]+)?)\s+—\s+/);
      return m ? m[1].toLowerCase() : "zzz_" + p.name.toLowerCase();
    };
    return window.PRODUCTS.
    filter((p) => {
      if (p.cat !== active) return false;
      if (!q) return true;
      return (p.name + " " + p.variant + " " + p.art + " " + p.dims).toLowerCase().includes(q);
    }).
    slice() // don't mutate
    .sort((a, b) => {
      // Group by sub first (preserves the existing sub-section split),
      // then by brand prefix, then by full name + variant.
      if (a.sub !== b.sub) return (a.sub || "").localeCompare(b.sub || "");
      const ba = brandOf(a),bb = brandOf(b);
      if (ba !== bb) return ba.localeCompare(bb);
      if (a.name !== b.name) return a.name.localeCompare(b.name);
      return a.variant.localeCompare(b.variant);
    });
  }, [active, query]);

  const subs = useMemoA(() => {
    const cat = window.CATEGORIES.find((c) => c.id === active);
    return cat?.sub || [];
  }, [active]);

  const [activeSub, setActiveSub] = useStateA("all");
  useEffectA(() => {setActiveSub("all");}, [active]);

  const filtered = useMemoA(() => {
    if (activeSub === "all") return products;
    return products.filter((p) => p.sub === activeSub);
  }, [products, activeSub]);

  return (
    <section className="cat-section" id="catalogue">
      <div className="cat-tabs">
        <div className="wrap">
          <div className="cat-tabs__row">
            {window.CATEGORIES.map((c) =>
            <button key={c.id}
            data-active={active === c.id}
            onClick={() => setActive(c.id)}>
                {t.cat[c.id]}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="cat-head">
          <h2>{t.cat[active]}</h2>
          <span className="count">{filtered.length} {t.catalogue.results}</span>
        </div>

        <div className="cat-toolbar">
          {subs.length > 0 &&
          <div className="cat-toolbar__group">
              <button className="chip" data-active={activeSub === "all"}
            onClick={() => setActiveSub("all")}>
                {t.catalogue.filter_all}
              </button>
              {subs.map((s) =>
            <button key={s} className="chip" data-active={activeSub === s}
            onClick={() => setActiveSub(s)}>
                  {t.sub[s] || s}
                </button>
            )}
            </div>
          }
          <div className="search-box">
            <Icon.Search />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder={t.catalogue.search} />
            {query && <button onClick={() => setQuery("")}><Icon.X /></button>}
          </div>
        </div>

        <div className="product-grid">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        {filtered.length === 0 &&
        <div style={{
          padding: "80px 20px", textAlign: "center",
          border: "1px dashed var(--line-2)",
          color: "var(--muted)"
        }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink)",
            textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {t.catalogue.no_matches} {t.cat[active]}
            </div>
            <div style={{ marginTop: 8 }}>{t.catalogue.try_clear}</div>
          </div>
        }
      </div>
    </section>);

}

// ─── Product card (new minimal markup) ────────────────────────────────────
function ProductCard({ product }) {
  const { t } = useI18n();
  const { add, items } = useCart();
  const inCart = items.some((x) => x.id === product.id);
  const [pulse, setPulse] = useStateA(false);
  const onAdd = () => {
    add(product);
    setPulse(true);
    setTimeout(() => setPulse(false), 700);
  };
  return (
    <article className="card">
      <ProductMedia product={product} />
      <button className="card__add" data-added={inCart || pulse} onClick={onAdd}
      aria-label={t.catalogue.add}>
        {inCart || pulse ? <Icon.Check /> : <Icon.Plus />}
      </button>
      <div className="card__body">
        <div className="card__name">{product.name}</div>
        <div className="card__variant">{product.variant}</div>
        <div className="card__meta">
          <span className="card__art-num">Art. {product.art}</span>
          <span className="card__dims">{product.dims}</span>
        </div>
        <div className="card__row2">
          <div className="card__price">
            {product.price != null ?
            <React.Fragment>{fmtPrice(product.price, t.locale)} kr<small>{t.catalogue.price_day}</small></React.Fragment> :
            <small>{t.catalogue.price_request}</small>}
          </div>
        </div>
      </div>
    </article>);

}

// ─── Inspiration — Rent the Look (hotspot pins) ──────────────────────────
function Inspiration() {
  const { t } = useI18n();
  const [scene, setScene] = useStateA(0);
  const [active, setActive] = useStateA(null);

  // Build 3 scenes from the catalog (using whichever products exist)
  const scenes = useMemoA(() => {
    const byCat = (cat) => window.PRODUCTS.filter((p) => p.cat === cat);
    const pick = (arr, n) => arr.slice(0, n);
    const s1 = [...pick(byCat("lounge"), 2), ...pick(byCat("tables"), 1), ...pick(byCat("lighting"), 1)].filter(Boolean);
    const s2 = [...pick(byCat("chairs"), 2), ...pick(byCat("tables"), 1), ...pick(byCat("tableware"), 1)].filter(Boolean);
    const s3 = [...pick(byCat("bars"), 1), ...pick(byCat("chairs"), 2), ...pick(byCat("lighting"), 1)].filter(Boolean);
    return [
    {
      name: "Conference Lounge — Copenhagen",
      tag: "Brand activation · 240 guests",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=2200&auto=format&fit=crop&q=72",
      items: s1.slice(0, 4),
      pins: [{ x: 24, y: 62 }, { x: 52, y: 54 }, { x: 74, y: 60 }, { x: 40, y: 34 }]
    },
    {
      name: "Gala Dinner — Royal Library",
      tag: "Premiere dinner · 180 guests",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=2200&auto=format&fit=crop&q=72",
      items: s2.slice(0, 4),
      pins: [{ x: 30, y: 64 }, { x: 58, y: 54 }, { x: 48, y: 40 }, { x: 72, y: 46 }]
    },
    {
      name: "Garden Bar — Tivoli",
      tag: "Summer party · 320 guests",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=2200&auto=format&fit=crop&q=72",
      items: s3.slice(0, 4),
      pins: [{ x: 35, y: 52 }, { x: 55, y: 62 }, { x: 70, y: 50 }, { x: 22, y: 64 }]
    }];

  }, []);

  const current = scenes[scene];
  const sc = t.inspo.scenes && t.inspo.scenes[scene] || current;

  return (
    <section className="inspo" id="inspiration">
      <div className="wrap">
        <div className="inspo__head">
          <p className="inspo__eyebrow">{t.inspo.eyebrow}</p>
          <h2>{t.inspo.title}</h2>
        </div>

        <div className="inspo__stage">
          <img className="inspo__image" src={current.image} alt={sc.name} loading="lazy" />
          <div className="inspo__caption">
            <div className="inspo__caption-name">{sc.name}</div>
            <div className="inspo__caption-tag">{sc.tag}</div>
          </div>
          {current.pins.map((pin, i) => current.items[i] &&
          <button key={i}
          className="hotspot"
          data-active={active === i}
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          onClick={() => setActive(active === i ? null : i)}>
              {i + 1}
            </button>
          )}
        </div>

        <div className="inspo__pickups">
          {current.items.map((p, i) =>
          <InspoPickup key={p.id} product={p} index={i} active={active === i}
          onHover={() => setActive(i)}
          onLeave={() => setActive(null)} />
          )}
        </div>

        <div className="inspo__scenes">
          {scenes.map((s, i) =>
          <button key={i} data-active={scene === i} onClick={() => {setScene(i);setActive(null);}}>
              {t.inspo.scene} 0{i + 1}
            </button>
          )}
        </div>
      </div>
    </section>);

}

function InspoPickup({ product, index, active, onHover, onLeave }) {
  const { t } = useI18n();
  const shape = useMemoA(() => window.silhouetteFor ? window.silhouetteFor(product) : null, [product.id]);
  return (
    <div className="pickup" data-active={active}
    onMouseEnter={onHover} onMouseLeave={onLeave}
    style={active ? { background: "var(--paper-2)" } : null}>
      <div className="pickup__num">{String(index + 1).padStart(2, "0")}</div>
      <div className="pickup__thumb">
        <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
          {shape && shape("rgba(22,20,15,0.7)")}
        </svg>
      </div>
      <div className="pickup__name">{product.name.split(" — ")[0]}</div>
      <div className="pickup__price">
        {product.price != null ? `${fmtPrice(product.price, t.locale)} kr ${t.inspo.price_day}` : t.inspo.price_request}
      </div>
    </div>);

}

// ─── Testimonials ────────────────────────────────────────────────────────
function Testimonials() {
  const { t } = useI18n();
  const quotes = t.quotes.items;

  return (
    <section className="quotes">
      <div className="wrap">
        <div className="quotes__head">
          <p className="eyebrow">{t.quotes.eyebrow}</p>
          <h2>{t.quotes.title_a}<br />{t.quotes.title_b}</h2>
        </div>
        <div className="quotes__grid">
          {quotes.map((q, i) =>
          <div className="quote" key={i}>
              <div className="quote__mark">"</div>
              <div className="quote__body">{q.body}</div>
              <div className="quote__by">
                <div className="quote__name">{q.name}</div>
                <div className="quote__role">{q.role}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ─── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer" id="contact">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <img src={window.__resources && window.__resources.logo_rg || "assets/rent-group-logo.png"} alt="Rent.Group" className="footer-brand-img" />
            <div className="footer-brand-tag">{t.footer.brand_tag}</div>
          </div>
          <div>
            <h4>{t.footer.addr_label}</h4>
            {t.footer.addr_lines.map((l, i) => <div key={i}>{l}</div>)}
            <div style={{ marginTop: 8, opacity: 0.6 }}>{t.footer.hours}</div>
          </div>
          <div>
            <h4>{t.footer.direct}</h4>
            <a href="tel:+4531767671">{t.footer.phone}</a><br />
            <a href="mailto:copenhagen@rent.group">{t.footer.email}</a>
          </div>
          <div>
            <h4>{t.footer.catalogue_label}</h4>
            {window.CATEGORIES.slice(0, 6).map((c) =>
            <div key={c.id}><a href="#catalogue">{t.cat[c.id]}</a></div>
            )}
          </div>
        </div>
        <div className="footer-legal">
          <span style={{ fontFamily: "Montserrat" }}>{t.footer.legal}</span>
          <span>{t.footer.made}</span>
        </div>
      </div>
    </footer>);

}

// ─── Tweaks panel ─────────────────────────────────────────────────────────
function PRTweaks({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Accent">
        <TweakColor value={tweaks.accent}
        options={["#C9B998", "#A8866A", "#3D4A3A", "#1B2A40", "#7A2E2A"]}
        onChange={(v) => setTweak("accent", v)} />
      </TweakSection>
      <TweakSection title="Sections">
        <TweakToggle label="Category shortcuts" checked={tweaks.showShortcuts}
        onChange={(v) => setTweak("showShortcuts", v)} />
        <TweakToggle label="Rent the look" checked={tweaks.showInspiration}
        onChange={(v) => setTweak("showInspiration", v)} />
        <TweakToggle label="Testimonials" checked={tweaks.showQuotes}
        onChange={(v) => setTweak("showQuotes", v)} />
      </TweakSection>
    </TweaksPanel>);

}

// Expose silhouetteFor on window so Inspiration can use it (it's defined in components.jsx scope)
if (typeof window !== 'undefined' && !window.silhouetteFor) {






















































































  // We re-import via the SVG path inside ProductMedia by reading the inner svg of a hidden product,
  // but simpler — components.jsx already keeps silhouetteFor in local scope. Expose it from there.
} // ─── Mount ─────────────────────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById("root")).render(<App />);