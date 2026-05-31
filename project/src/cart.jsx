// Party.Rent Denmark — cart context, drawer, request flow
const { useState: useStateC, useEffect: useEffectC, useMemo: useMemoC,
        useContext: useContextC, createContext: createContextC } = React;

// ─── Cart context ──────────────────────────────────────────────────────────
const CartCtx = createContextC(null);
const useCart = () => useContextC(CartCtx);

function CartProvider({ children }) {
  const [items, setItems] = useStateC(() => {
    try { return JSON.parse(localStorage.getItem("pr_cart") || "[]"); } catch { return []; }
  });
  const [open, setOpen]   = useStateC(false);
  const [step, setStep]   = useStateC("cart"); // cart | event | contact | success
  const [order, setOrder] = useStateC({
    eventName: "", venue: "", dateIn: "", dateOut: "", guests: "", notes: "",
    company: "", name: "", email: "", phone: "",
    ref: "",
  });

  useEffectC(() => {
    localStorage.setItem("pr_cart", JSON.stringify(items));
  }, [items]);

  const add = (product) => {
    setItems((arr) => {
      const found = arr.find((x) => x.id === product.id);
      if (found) return arr.map((x) => x.id === product.id ? { ...x, qty: x.qty + 1 } : x);
      return [...arr, { id: product.id, qty: 1, art: product.art, name: product.name,
                        variant: product.variant, dims: product.dims,
                        price: product.price, tint: product.tint }];
    });
  };
  const setQty = (id, qty) => {
    setItems((arr) =>
      qty <= 0 ? arr.filter((x) => x.id !== id)
               : arr.map((x) => x.id === id ? { ...x, qty } : x)
    );
  };
  const remove = (id) => setItems((arr) => arr.filter((x) => x.id !== id));
  const clear  = ()    => setItems([]);

  const count    = items.reduce((n, x) => n + x.qty, 0);
  const subtotal = items.reduce((s, x) => s + (x.price || 0) * x.qty, 0);

  const value = { items, count, subtotal, add, setQty, remove, clear,
                  open, setOpen, step, setStep, order, setOrder };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

// ─── Cart drawer + flow ────────────────────────────────────────────────────
function CartDrawer() {
  const { t, lang } = useI18n();
  const cart = useCart();
  const { open, setOpen, step, setStep } = cart;

  useEffectC(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  return (
    <React.Fragment>
      <div className="drawer-backdrop" data-open={open} onClick={() => setOpen(false)} />
      <aside className="drawer" data-open={open} aria-hidden={!open}>
        <header className="drawer__head">
          <div className="drawer__title">
            {step === "success" ? t.cart.success_title : t.cart.title}
          </div>
          <button className="drawer__close" onClick={() => setOpen(false)} aria-label="Close">
            <Icon.X />
          </button>
        </header>

        {step !== "success" && cart.items.length > 0 && (
          <div className="steps">
            <StepDot n="1" id="cart"    label={t.cart.title.split(" ")[0]} />
            <span className="steps__sep" />
            <StepDot n="2" id="event"   label={t.cart.step_event} />
            <span className="steps__sep" />
            <StepDot n="3" id="contact" label={t.cart.step_contact} />
          </div>
        )}

        <div className="drawer__body">
          {step === "cart"    && <CartList />}
          {step === "event"   && <EventForm />}
          {step === "contact" && <ContactForm />}
          {step === "success" && <SuccessView />}
        </div>

        {step !== "success" && cart.items.length > 0 && (
          <div className="drawer__foot">
            {step === "cart" && (
              <React.Fragment>
                <div className="foot-row">
                  <span className="foot-row__l">{t.cart.subtotal}</span>
                  <span className="foot-row__r">
                    DKK {fmtPrice(cart.subtotal, t.locale)}
                  </span>
                </div>
                <p className="vat-note">{t.cart.vat_note}</p>
                <button className="btn btn-primary btn-block" onClick={() => setStep("event")}>
                  {t.cart.continue} <Icon.Arrow />
                </button>
                <div className="email-note">{t.cart.to_email}</div>
              </React.Fragment>
            )}
            {step === "event" && (
              <FlowButtons backTo="cart" nextTo="contact" />
            )}
            {step === "contact" && (
              <SubmitButton />
            )}
          </div>
        )}
      </aside>
    </React.Fragment>
  );
}

function StepDot({ n, id, label }) {
  const { step, setStep } = useCart();
  const order = ["cart", "event", "contact"];
  const active = order.indexOf(step) >= order.indexOf(id);
  return (
    <button className="steps__item" data-active={active} onClick={() => setStep(id)}>
      <span className="steps__dot">{n}</span>{label}
    </button>
  );
}

function CartList() {
  const { t } = useI18n();
  const cart = useCart();
  if (cart.items.length === 0) {
    return (
      <div className="empty">
        <Icon.Cart width="32" height="32" />
        <div className="empty__title">{t.cart.empty_title}</div>
        <div className="empty__lead">{t.cart.empty_lead}</div>
        <button className="btn btn-ghost" onClick={() => cart.setOpen(false)}>
          {t.cart.empty_cta} <Icon.Arrow />
        </button>
      </div>
    );
  }
  return (
    <div>
      {cart.items.map((it) => <CartLine key={it.id} it={it} />)}
    </div>
  );
}

function CartLine({ it }) {
  const { t } = useI18n();
  const { setQty, remove } = useCart();
  const tint = window.TINTS[it.tint] || window.TINTS.ivory;
  return (
    <div className="line">
      <div className="line__thumb"
           style={{ background: `linear-gradient(160deg, ${tint.paper}, ${tint.swatch})` }} />
      <div>
        <div className="line__name">{it.name}</div>
        <div className="line__variant">{it.variant}</div>
        <div className="line__art">{t.catalogue.art} {it.art} · {it.dims}</div>
      </div>
      <div className="line__right">
        <div className="line__price">
          {it.price != null
            ? <React.Fragment>DKK {fmtPrice(it.price * it.qty, t.locale)}</React.Fragment>
            : <span style={{color:"var(--muted)", fontSize:11}}>{t.catalogue.price_request}</span>}
        </div>
        <div className="qty">
          <button onClick={() => setQty(it.id, it.qty - 1)}>−</button>
          <span>{it.qty}</span>
          <button onClick={() => setQty(it.id, it.qty + 1)}>+</button>
        </div>
        <button className="line__remove" onClick={() => remove(it.id)}>
          {t.cart.line_remove}
        </button>
      </div>
    </div>
  );
}

function EventForm() {
  const { t } = useI18n();
  const { order, setOrder } = useCart();
  const u = (k) => (e) => setOrder({ ...order, [k]: e.target.value });
  return (
    <div>
      <div className="field">
        <label>{t.cart.event_name}</label>
        <input value={order.eventName} onChange={u("eventName")} placeholder="—" />
      </div>
      <div className="field">
        <label>{t.cart.event_venue}</label>
        <input value={order.venue} onChange={u("venue")} placeholder="—" />
      </div>
      <div className="field-row">
        <div className="field">
          <label>{t.cart.event_date_in}</label>
          <input type="date" value={order.dateIn} onChange={u("dateIn")} />
        </div>
        <div className="field">
          <label>{t.cart.event_date_out}</label>
          <input type="date" value={order.dateOut} onChange={u("dateOut")} />
        </div>
      </div>
      <div className="field">
        <label>{t.cart.event_guests}</label>
        <input type="number" min="1" value={order.guests} onChange={u("guests")} placeholder="—" />
      </div>
      <div className="field">
        <label>{t.cart.event_notes}</label>
        <textarea value={order.notes} onChange={u("notes")} placeholder="—" />
      </div>
    </div>
  );
}

function ContactForm() {
  const { t } = useI18n();
  const { order, setOrder } = useCart();
  const u = (k) => (e) => setOrder({ ...order, [k]: e.target.value });
  return (
    <div>
      <div className="field">
        <label>{t.cart.contact_company}</label>
        <input value={order.company} onChange={u("company")} placeholder="—" />
      </div>
      <div className="field">
        <label>{t.cart.contact_name}</label>
        <input value={order.name} onChange={u("name")} placeholder="—" />
      </div>
      <div className="field-row">
        <div className="field">
          <label>{t.cart.contact_email}</label>
          <input type="email" value={order.email} onChange={u("email")} placeholder="—" />
        </div>
        <div className="field">
          <label>{t.cart.contact_phone}</label>
          <input type="tel" value={order.phone} onChange={u("phone")} placeholder="—" />
        </div>
      </div>
    </div>
  );
}

function FlowButtons({ backTo, nextTo }) {
  const { t } = useI18n();
  const { setStep } = useCart();
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button className="btn btn-ghost" onClick={() => setStep(backTo)}>{t.cart.back}</button>
      <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}
              onClick={() => setStep(nextTo)}>
        {t.cart.continue} <Icon.Arrow />
      </button>
    </div>
  );
}

function SubmitButton() {
  const { t } = useI18n();
  const { setStep, items, order, setOrder, clear } = useCart();
  const [sending, setSending] = useStateC(false);
  const submit = () => {
    setSending(true);
    // Simulate dispatch — in production this would post to a backend that
    // mails copenhagen@rent.group. Here we generate a reference and persist.
    const ref = "PR-" + new Date().getFullYear().toString().slice(-2) +
                "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    setTimeout(() => {
      setOrder({ ...order, ref });
      try {
        const log = JSON.parse(localStorage.getItem("pr_orders") || "[]");
        log.push({ ref, when: new Date().toISOString(), items, order: { ...order, ref } });
        localStorage.setItem("pr_orders", JSON.stringify(log));
      } catch {}
      clear();
      setSending(false);
      setStep("success");
    }, 900);
  };
  return (
    <React.Fragment>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-ghost" onClick={() => setStep("event")}>{t.cart.back}</button>
        <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}
                disabled={sending} onClick={submit}>
          {sending ? t.cart.sending : t.cart.submit} {!sending && <Icon.Arrow />}
        </button>
      </div>
      <div className="email-note">{t.cart.to_email}</div>
    </React.Fragment>
  );
}

function SuccessView() {
  const { t } = useI18n();
  const { setOpen, setStep, order } = useCart();
  return (
    <div className="success">
      <div className="success__icon"><Icon.Check width="28" height="28" /></div>
      <h2 className="success__title">{t.cart.success_title}</h2>
      <p className="success__lead">{t.cart.success_lead}</p>
      <div className="success__ref">
        <Icon.Tag /> {t.cart.success_ref} <strong>{order.ref}</strong>
      </div>
      <div>
        <button className="btn btn-ghost"
                onClick={() => { setOpen(false); setStep("cart"); }}>
          {t.cart.success_back}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { CartCtx, CartProvider, useCart, CartDrawer });
