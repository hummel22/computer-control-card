const U = globalThis, z = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, j = /* @__PURE__ */ Symbol(), G = /* @__PURE__ */ new WeakMap();
let dt = class {
  constructor(t, i, s) {
    if (this._$cssResult$ = !0, s !== j) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (z && t === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (t = G.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && G.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const mt = (e) => new dt(typeof e == "string" ? e : e + "", void 0, j), gt = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((s, n, o) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + e[o + 1], e[0]);
  return new dt(i, e, j);
}, vt = (e, t) => {
  if (z) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const s = document.createElement("style"), n = U.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = i.cssText, e.appendChild(s);
  }
}, Y = z ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const s of t.cssRules) i += s.cssText;
  return mt(i);
})(e) : e;
const { is: yt, defineProperty: $t, getOwnPropertyDescriptor: bt, getOwnPropertyNames: wt, getOwnPropertySymbols: At, getPrototypeOf: xt } = Object, L = globalThis, K = L.trustedTypes, St = K ? K.emptyScript : "", Ct = L.reactiveElementPolyfillSupport, C = (e, t) => e, H = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? St : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, I = (e, t) => !yt(e, t), Z = { attribute: !0, type: String, converter: H, reflect: !1, useDefault: !1, hasChanged: I };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), L.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let w = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Z) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(t, s, i);
      n !== void 0 && $t(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    const { get: n, set: o } = bt(this.prototype, t) ?? { get() {
      return this[i];
    }, set(r) {
      this[i] = r;
    } };
    return { get: n, set(r) {
      const c = n?.call(this);
      o?.call(this, r), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Z;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const t = xt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const i = this.properties, s = [...wt(i), ...At(i)];
      for (const n of s) this.createProperty(n, i[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [s, n] of i) this.elementProperties.set(s, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const n = this._$Eu(i, s);
      n !== void 0 && this._$Eh.set(n, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const n of s) i.unshift(Y(n));
    } else t !== void 0 && i.push(Y(t));
    return i;
  }
  static _$Eu(t, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const s of i.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return vt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, s) {
    this._$AK(t, s);
  }
  _$ET(t, i) {
    const s = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, s);
    if (n !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : H).toAttribute(i, s.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = s.getPropertyOptions(n), r = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : H;
      this._$Em = n;
      const c = r.fromAttribute(i, o.type);
      this[n] = c ?? this._$Ej?.get(n) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, i, s, n = !1, o) {
    if (t !== void 0) {
      const r = this.constructor;
      if (n === !1 && (o = this[t]), s ??= r.getPropertyOptions(t), !((s.hasChanged ?? I)(o, i) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, s)))) return;
      this.C(t, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: s, reflect: n, wrapped: o }, r) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? i ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (i = void 0), this._$AL.set(t, i)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, o] of s) {
        const { wrapped: r } = o, c = this[n];
        r !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, o, c);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[C("elementProperties")] = /* @__PURE__ */ new Map(), w[C("finalized")] = /* @__PURE__ */ new Map(), Ct?.({ ReactiveElement: w }), (L.reactiveElementVersions ??= []).push("2.1.2");
const B = globalThis, J = (e) => e, R = B.trustedTypes, Q = R ? R.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ht = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, ut = "?" + g, Ot = `<${ut}>`, $ = document, E = () => $.createComment(""), k = (e) => e === null || typeof e != "object" && typeof e != "function", F = Array.isArray, Et = (e) => F(e) || typeof e?.[Symbol.iterator] == "function", W = `[ 	
\f\r]`, S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, X = /-->/g, tt = />/g, v = RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), et = /'/g, it = /"/g, pt = /^(?:script|style|textarea|title)$/i, kt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), p = kt(1), A = /* @__PURE__ */ Symbol.for("lit-noChange"), l = /* @__PURE__ */ Symbol.for("lit-nothing"), st = /* @__PURE__ */ new WeakMap(), y = $.createTreeWalker($, 129);
function _t(e, t) {
  if (!F(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Q !== void 0 ? Q.createHTML(t) : t;
}
const Pt = (e, t) => {
  const i = e.length - 1, s = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = S;
  for (let c = 0; c < i; c++) {
    const a = e[c];
    let h, u, d = -1, f = 0;
    for (; f < a.length && (r.lastIndex = f, u = r.exec(a), u !== null); ) f = r.lastIndex, r === S ? u[1] === "!--" ? r = X : u[1] !== void 0 ? r = tt : u[2] !== void 0 ? (pt.test(u[2]) && (n = RegExp("</" + u[2], "g")), r = v) : u[3] !== void 0 && (r = v) : r === v ? u[0] === ">" ? (r = n ?? S, d = -1) : u[1] === void 0 ? d = -2 : (d = r.lastIndex - u[2].length, h = u[1], r = u[3] === void 0 ? v : u[3] === '"' ? it : et) : r === it || r === et ? r = v : r === X || r === tt ? r = S : (r = v, n = void 0);
    const m = r === v && e[c + 1].startsWith("/>") ? " " : "";
    o += r === S ? a + Ot : d >= 0 ? (s.push(h), a.slice(0, d) + ht + a.slice(d) + g + m) : a + g + (d === -2 ? c : m);
  }
  return [_t(e, o + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class P {
  constructor({ strings: t, _$litType$: i }, s) {
    let n;
    this.parts = [];
    let o = 0, r = 0;
    const c = t.length - 1, a = this.parts, [h, u] = Pt(t, i);
    if (this.el = P.createElement(h, s), y.currentNode = this.el.content, i === 2 || i === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (n = y.nextNode()) !== null && a.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const d of n.getAttributeNames()) if (d.endsWith(ht)) {
          const f = u[r++], m = n.getAttribute(d).split(g), T = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: o, name: T[2], strings: m, ctor: T[1] === "." ? Nt : T[1] === "?" ? Tt : T[1] === "@" ? Ut : D }), n.removeAttribute(d);
        } else d.startsWith(g) && (a.push({ type: 6, index: o }), n.removeAttribute(d));
        if (pt.test(n.tagName)) {
          const d = n.textContent.split(g), f = d.length - 1;
          if (f > 0) {
            n.textContent = R ? R.emptyScript : "";
            for (let m = 0; m < f; m++) n.append(d[m], E()), y.nextNode(), a.push({ type: 2, index: ++o });
            n.append(d[f], E());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ut) a.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = n.data.indexOf(g, d + 1)) !== -1; ) a.push({ type: 7, index: o }), d += g.length - 1;
      }
      o++;
    }
  }
  static createElement(t, i) {
    const s = $.createElement("template");
    return s.innerHTML = t, s;
  }
}
function x(e, t, i = e, s) {
  if (t === A) return t;
  let n = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const o = k(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== o && (n?._$AO?.(!1), o === void 0 ? n = void 0 : (n = new o(e), n._$AT(e, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = n : i._$Cl = n), n !== void 0 && (t = x(e, n._$AS(e, t.values), n, s)), t;
}
class Mt {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: s } = this._$AD, n = (t?.creationScope ?? $).importNode(i, !0);
    y.currentNode = n;
    let o = y.nextNode(), r = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let h;
        a.type === 2 ? h = new M(o, o.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (h = new Ht(o, this, t)), this._$AV.push(h), a = s[++c];
      }
      r !== a?.index && (o = y.nextNode(), r++);
    }
    return y.currentNode = $, n;
  }
  p(t) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }
}
class M {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, s, n) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && t?.nodeType === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = x(this, t, i), k(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Et(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && k(this._$AH) ? this._$AA.nextSibling.data = t : this.T($.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = P.createElement(_t(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === n) this._$AH.p(i);
    else {
      const o = new Mt(n, this), r = o.u(this.options);
      o.p(i), this.T(r), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = st.get(t.strings);
    return i === void 0 && st.set(t.strings, i = new P(t)), i;
  }
  k(t) {
    F(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, n = 0;
    for (const o of t) n === i.length ? i.push(s = new M(this.O(E()), this.O(E()), this, this.options)) : s = i[n], s._$AI(o), n++;
    n < i.length && (this._$AR(s && s._$AB.nextSibling, n), i.length = n);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const s = J(t).nextSibling;
      J(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class D {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, s, n, o) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = i, this._$AM = n, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = l;
  }
  _$AI(t, i = this, s, n) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = x(this, t, i, 0), r = !k(t) || t !== this._$AH && t !== A, r && (this._$AH = t);
    else {
      const c = t;
      let a, h;
      for (t = o[0], a = 0; a < o.length - 1; a++) h = x(this, c[s + a], i, a), h === A && (h = this._$AH[a]), r ||= !k(h) || h !== this._$AH[a], h === l ? t = l : t !== l && (t += (h ?? "") + o[a + 1]), this._$AH[a] = h;
    }
    r && !n && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Nt extends D {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class Tt extends D {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class Ut extends D {
  constructor(t, i, s, n, o) {
    super(t, i, s, n, o), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = x(this, t, i, 0) ?? l) === A) return;
    const s = this._$AH, n = t === l && s !== l || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== l && (s === l || n);
    n && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ht {
  constructor(t, i, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    x(this, t);
  }
}
const Rt = B.litHtmlPolyfillSupport;
Rt?.(P, M), (B.litHtmlVersions ??= []).push("3.3.3");
const Lt = (e, t, i) => {
  const s = i?.renderBefore ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const o = i?.renderBefore ?? null;
    s._$litPart$ = n = new M(t.insertBefore(E(), o), o, void 0, i ?? {});
  }
  return n._$AI(e), n;
};
const V = globalThis;
class O extends w {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Lt(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return A;
  }
}
O._$litElement$ = !0, O.finalized = !0, V.litElementHydrateSupport?.({ LitElement: O });
const Dt = V.litElementPolyfillSupport;
Dt?.({ LitElement: O });
(V.litElementVersions ??= []).push("4.2.2");
const Wt = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const zt = { attribute: !0, type: String, converter: H, reflect: !1, hasChanged: I }, jt = (e = zt, t, i) => {
  const { kind: s, metadata: n } = i;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(i.name, e), s === "accessor") {
    const { name: r } = i;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(r, a, e, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, e, c), c;
    } };
  }
  if (s === "setter") {
    const { name: r } = i;
    return function(c) {
      const a = this[r];
      t.call(this, c), this.requestUpdate(r, a, e, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function ft(e) {
  return (t, i) => typeof i == "object" ? jt(e, t, i) : ((s, n, o) => {
    const r = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, s), r ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(e, t, i);
}
function q(e) {
  return ft({ ...e, state: !0, attribute: !1 });
}
const It = "Wake this computer?", Bt = "Shut down this computer?", Ft = "Turn on the outlet?", Vt = "Turn off the outlet?", nt = (e, t) => ({
  ...e,
  ...t,
  service_data: {
    ...e.service_data ?? {},
    ...t?.service_data ?? {}
  }
}), qt = (e) => {
  const t = [];
  return e.wol_mac && t.push({
    key: "wake",
    label: "Wake PC",
    icon: "mdi:power",
    domain: "wake_on_lan",
    service: "send_magic_packet",
    service_data: {
      mac: e.wol_mac,
      ...e.broadcast_address ? { broadcast_address: e.broadcast_address } : {}
    },
    confirmation: It
  }), e.shutdown_entity && t.push({
    key: "shutdown",
    label: "Shutdown",
    icon: "mdi:power-off",
    domain: "button",
    service: "press",
    service_data: { entity_id: e.shutdown_entity },
    confirmation: Bt
  }), e.outlet_entity && t.push(
    nt(
      {
        key: "outlet_on",
        label: "Outlet On",
        icon: "mdi:power-plug",
        domain: "switch",
        service: "turn_on",
        service_data: { entity_id: e.outlet_entity },
        confirmation: Ft
      },
      e.outlet_actions?.turn_on
    ),
    nt(
      {
        key: "outlet_off",
        label: "Outlet Off",
        icon: "mdi:power-plug-off",
        domain: "switch",
        service: "turn_off",
        service_data: { entity_id: e.outlet_entity },
        confirmation: Vt
      },
      e.outlet_actions?.turn_off
    )
  ), t;
}, Gt = /* @__PURE__ */ new Set(["unavailable", "unknown"]), ot = (e) => {
  if (typeof e != "string")
    return;
  const t = e.trim().toLowerCase();
  return t.length > 0 ? t : void 0;
}, rt = (e) => !e || Gt.has(e), Yt = (e) => {
  if (typeof e == "number")
    return Number.isFinite(e) ? e : void 0;
  if (typeof e == "string" && e.trim().length > 0) {
    const t = Number(e);
    return Number.isFinite(t) ? t : void 0;
  }
}, Kt = (e) => Number.isFinite(e.idleWatts) && Number.isFinite(e.activeWatts), Zt = (e) => {
  const t = ot(e.outletState);
  if (rt(t))
    return "unknown";
  if (t === "off")
    return "outlet_off";
  if (t !== "on")
    return "unknown";
  const i = ot(e.statusState);
  if (rt(i) || !Kt(e.thresholds))
    return "unknown";
  if (i === "on")
    return "online";
  if (i !== "off")
    return "unknown";
  const s = Yt(e.powerWatts);
  return s === void 0 ? "unknown" : s < e.thresholds.idleWatts ? "offline_standby" : s > e.thresholds.activeWatts ? "booting_or_service_unavailable" : "unknown";
}, _ = (e, t) => {
  if (!(!e || !t))
    return e.states[t];
}, Jt = (e, t) => {
  if (e.name)
    return e.name;
  const i = t?.attributes.friendly_name;
  return typeof i == "string" && i.length > 0 ? i : e.entity ?? "Computer";
}, Qt = gt`
  :host {
    display: block;
  }

  ha-card {
    display: block;
    overflow: hidden;
    padding: 16px;
  }

  .compact-shell,
  .extended-shell {
    display: grid;
    gap: 16px;
  }

  .compact-header,
  .extended-header,
  .identity,
  .header-trailing,
  .action-pair {
    align-items: center;
    display: flex;
    gap: 12px;
  }

  .compact-header,
  .extended-header {
    justify-content: space-between;
  }

  .avatar {
    align-items: center;
    background: color-mix(in srgb, var(--primary-color) 14%, transparent);
    border-radius: 16px;
    color: var(--primary-color);
    display: inline-flex;
    height: 44px;
    justify-content: center;
    width: 44px;
  }

  h2,
  h3,
  p {
    margin: 0;
  }

  h2 {
    color: var(--primary-text-color);
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
  }

  h3 {
    color: var(--primary-text-color);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .status,
  .subtle,
  .empty,
  .note,
  .trend,
  .warning,
  .metric span {
    color: var(--secondary-text-color);
    font-size: 13px;
  }

  .status {
    text-transform: capitalize;
  }

  .status-pill {
    background: color-mix(in srgb, var(--primary-color) 16%, var(--card-background-color));
    border: 1px solid color-mix(in srgb, var(--primary-color) 24%, var(--divider-color));
    border-radius: 999px;
    color: var(--primary-text-color);
    font-size: 12px;
    padding: 5px 10px;
    text-transform: capitalize;
    white-space: nowrap;
  }

  .signal-row,
  .metric-row {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .signal {
    align-items: flex-start;
    flex-direction: column;
    min-height: 92px;
  }

  .signal ha-icon {
    color: var(--disabled-text-color, #9b9b9b);
  }

  .signal.on ha-icon {
    color: var(--success-color, #43a047);
  }

  .signal.stale ha-icon {
    color: var(--error-color, #db4437);
  }

  .signal strong,
  .metric strong,
  .status-banner strong {
    color: var(--primary-text-color);
    font-size: 16px;
    text-transform: capitalize;
  }

  .icon-button {
    border-radius: 999px;
    min-height: 38px;
    padding: 8px;
    width: 38px;
  }

  .popover,
  .status-banner,
  .metric,
  section,
  .note {
    background: var(--secondary-background-color, #f4f4f4);
    border: 1px solid var(--divider-color, transparent);
    border-radius: 18px;
    padding: 14px;
  }

  .popover {
    box-shadow: var(--ha-card-box-shadow, 0 4px 16px rgb(0 0 0 / 14%));
    display: grid;
    gap: 12px;
  }

  .status-banner {
    background: linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 24%, var(--card-background-color)), var(--secondary-background-color, #f4f4f4));
    display: grid;
    gap: 4px;
  }

  .joined {
    gap: 0;
  }

  .joined .metric {
    border-radius: 0;
  }

  .joined .metric:first-child {
    border-bottom-left-radius: 18px;
    border-top-left-radius: 18px;
  }

  .joined .metric:last-child {
    border-bottom-right-radius: 18px;
    border-top-right-radius: 18px;
  }

  .metric {
    display: grid;
    gap: 6px;
  }

  .metric.unavailable {
    background: color-mix(in srgb, var(--secondary-background-color, #f4f4f4) 82%, var(--disabled-text-color, #9b9b9b));
    opacity: 0.68;
  }

  .metric.unavailable strong {
    color: var(--disabled-text-color, var(--secondary-text-color));
  }

  section {
    display: grid;
    gap: 10px;
  }

  .warning {
    color: var(--warning-color, #b26a00);
  }

  .actions {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
  }

  button {
    align-items: center;
    background: var(--secondary-background-color, #f4f4f4);
    border: 1px solid var(--divider-color, transparent);
    border-radius: 12px;
    color: var(--primary-text-color);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    gap: 8px;
    justify-content: center;
    min-height: 44px;
    padding: 8px 12px;
  }

  button:hover:not(:disabled) {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  button.action-positive:not(:disabled) ha-icon {
    color: var(--success-color, #43a047);
  }

  button.action-negative:not(:disabled) ha-icon {
    color: var(--error-color, #db4437);
  }

  button.action-positive:hover:not(:disabled),
  button.action-negative:hover:not(:disabled) {
    color: var(--text-primary-color, #fff);
  }

  button.action-positive:hover:not(:disabled) ha-icon,
  button.action-negative:hover:not(:disabled) ha-icon {
    color: currentcolor;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .confirm-backdrop {
    align-items: center;
    background: rgb(0 0 0 / 28%);
    display: flex;
    inset: 0;
    justify-content: center;
    position: fixed;
    z-index: 10;
  }

  .confirm-dialog {
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color, transparent);
    border-radius: 18px;
    box-shadow: var(--ha-card-box-shadow, 0 12px 32px rgb(0 0 0 / 28%));
    color: var(--primary-text-color);
    display: grid;
    gap: 14px;
    max-width: min(360px, calc(100vw - 32px));
    padding: 18px;
  }

  @media (max-width: 420px) {
    .compact-header,
    .action-pair {
      align-items: stretch;
      flex-direction: column;
    }

    .signal-row,
    .metric-row {
      grid-template-columns: 1fr;
    }
  }
`;
var Xt = Object.defineProperty, te = Object.getOwnPropertyDescriptor, N = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? te(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (s ? r(t, i, n) : r(n)) || n);
  return s && n && Xt(t, i, n), n;
};
const at = "custom:computer-control-card", ct = { idleWatts: 10, activeWatts: 40 }, lt = {
  compact: { columns: 6, rows: 5, cardSize: 5 },
  extended: { columns: 12, rows: 11, cardSize: 11 }
}, ee = {
  title: "Card header",
  name: "Computer name",
  entity: "Summary entity",
  status_entity: "Status entity",
  power_entity: "Power entity",
  energy_today_entity: "Energy today entity",
  energy_month_entity: "Energy month entity",
  energy_total_entity: "Energy total entity",
  wol_mac: "Wake-on-LAN MAC address",
  broadcast_address: "Wake-on-LAN broadcast address",
  shutdown_entity: "Shutdown button entity",
  outlet_entity: "Outlet switch entity",
  variant: "Layout variant",
  thresholds: "Power thresholds",
  idleWatts: "Idle watts",
  activeWatts: "Active watts",
  outlet_actions: "Generated outlet action overrides",
  actions: "Fully custom action list"
}, ie = {
  entity: "Main entity used for the display state and fallback metric attributes.",
  status_entity: "Optional online/status entity, for example a binary sensor.",
  power_entity: "Optional current power draw sensor, usually measured in watts.",
  energy_today_entity: "Optional daily energy sensor. If unset, the card falls back to summary attributes.",
  energy_month_entity: "Optional monthly energy sensor. If unset, the card falls back to summary attributes.",
  energy_total_entity: "Optional lifetime/total energy sensor.",
  wol_mac: "Optional MAC address used to generate the Wake PC action.",
  broadcast_address: "Optional broadcast address for wake_on_lan.send_magic_packet.",
  shutdown_entity: "Optional button entity used to generate a protected shutdown action.",
  outlet_entity: "Optional switch entity used to generate protected outlet on/off actions.",
  thresholds: "Optional values used with status and power entities to derive standby, online, and booting states.",
  outlet_actions: "Optional YAML object for turn_on/turn_off overrides such as icon, label, service_data, or confirmation.",
  actions: "Optional YAML array of complete custom actions. When supplied, it replaces generated actions."
}, se = [
  { name: "title", selector: { text: {} } },
  { name: "name", selector: { text: {} } },
  { name: "entity", selector: { entity: {} } },
  { name: "status_entity", selector: { entity: {} } },
  { name: "power_entity", selector: { entity: { domain: "sensor" } } },
  { name: "energy_today_entity", selector: { entity: { domain: "sensor" } } },
  { name: "energy_month_entity", selector: { entity: { domain: "sensor" } } },
  { name: "energy_total_entity", selector: { entity: { domain: "sensor" } } },
  { name: "wol_mac", selector: { text: {} } },
  { name: "broadcast_address", selector: { text: {} } },
  { name: "shutdown_entity", selector: { entity: { domain: "button" } } },
  { name: "outlet_entity", selector: { entity: { domain: "switch" } } },
  {
    name: "variant",
    selector: {
      select: {
        options: [
          { label: "Compact", value: "compact" },
          { label: "Extended", value: "extended" }
        ]
      }
    }
  },
  {
    type: "grid",
    name: "thresholds",
    schema: [
      { name: "idleWatts", selector: { number: { min: 0, mode: "box", step: 1, unit_of_measurement: "W" } } },
      { name: "activeWatts", selector: { number: { min: 0, mode: "box", step: 1, unit_of_measurement: "W" } } }
    ]
  },
  { name: "outlet_actions", selector: { object: {} } },
  { name: "actions", selector: { object: {} } }
];
let b = class extends O {
  static getConfigForm() {
    return {
      schema: se,
      computeLabel: (e) => ee[e.name],
      computeHelper: (e) => ie[e.name]
    };
  }
  static getStubConfig() {
    return {
      name: "Computer",
      variant: "compact"
    };
  }
  setConfig(e) {
    if (e.type !== at)
      throw new Error(`Expected card type "${at}".`);
    this._config = {
      ...e,
      variant: e.variant ?? "compact",
      actions: e.actions ?? qt(e)
    };
  }
  getCardSize() {
    return this._layout().cardSize;
  }
  getGridOptions() {
    const { columns: e, rows: t } = this._layout();
    return { columns: e, rows: t };
  }
  render() {
    if (!this._config)
      return p`<ha-card><div class="empty">Card is not configured.</div></ha-card>`;
    const e = _(this.hass, this._config.entity), t = _(this.hass, this._config.outlet_entity), i = _(this.hass, this._config.status_entity), s = _(this.hass, this._config.power_entity), n = _(this.hass, this._config.energy_today_entity), o = _(this.hass, this._config.energy_month_entity), r = _(this.hass, this._config.energy_total_entity), c = Jt(this._config, e), a = this._statusLabel(Zt({
      outletState: t?.state,
      statusState: i?.state,
      powerWatts: s?.state,
      thresholds: this._thresholds()
    })), h = this._config.variant === "extended" ? "extended" : "compact";
    return p`
      <ha-card header=${this._config.title ?? l} class=${h}>
        ${h === "extended" ? this._renderExtended(e, n, o, r, c, a) : this._renderCompact(e, t, s, n, o, r, c, a)}
      </ha-card>
    `;
  }
  _layout() {
    return this._config?.variant === "extended" ? lt.extended : lt.compact;
  }
  _renderCompact(e, t, i, s, n, o, r, c) {
    return p`
      <div class="compact-shell">
        <div class="compact-header">
          <div class="identity">
            <div class="avatar"><ha-icon icon="mdi:desktop-tower-monitor"></ha-icon></div>
            <div>
              <h2>${r}</h2>
              <div class="subtle">Remote computer</div>
            </div>
          </div>
          <div class="header-trailing">
            <span class="status-pill">${c}</span>
            <button class="icon-button" type="button" aria-label="More options">
              <ha-icon icon="mdi:dots-vertical"></ha-icon>
            </button>
          </div>
        </div>
        <div class="signal-row">
          ${this._renderSignal("outlet", "Power Outlet", this._outletStatus(e, t), "mdi:power-plug", this._entityOnOffState(t))}
          ${this._renderSignal("pc", "PC Status", c, "mdi:desktop-tower", this._pcSignalState(c))}
          ${this._renderSignal("draw", "System Draw", this._powerMetric(e, i), "mdi:flash", this._powerSignalState(i))}
        </div>
        ${this._activePanel ? this._renderPanel(this._activePanel, e, s, n, o, c) : l}
        ${this._renderConfirmationDialog()}
      </div>
    `;
  }
  _renderExtended(e, t, i, s, n, o) {
    return p`
      <div class="extended-shell">
        <div class="extended-header">
          <div class="identity">
            <div class="avatar"><ha-icon icon="mdi:desktop-tower-monitor"></ha-icon></div>
            <div>
              <h2>${n}</h2>
              <div class="status">${o}</div>
            </div>
          </div>
        </div>
        <div class="status-banner">
          <span>Current status</span>
          <strong>${o}</strong>
        </div>
        <div class="metric-row joined">
          ${this._renderMetric("Outlet", this._outletStatus(e, _(this.hass, this._config?.outlet_entity)))}
          ${this._renderMetric("Today", this._entityMetricValue(t, e, ["today_kwh", "energy_today"]))}
          ${this._renderMetric("Month", this._entityMetricValue(i, e, ["month_kwh", "energy_month"]))}
          ${s ? this._renderMetric("Total", this._entityMetricValue(s, e, ["total_kwh", "energy_total"])) : l}
        </div>
        <section>
          <h3>Machine Actions</h3>
          <div class="action-pair">
            ${this._renderActionButton("Shutdown", "mdi:power-off", this._findAction("shutdown"), "negative")}
            ${this._renderActionButton("Wake PC", "mdi:power", this._findAction("wake"), "positive")}
          </div>
        </section>
        <section>
          <h3>Power Controls</h3>
          <div class="action-pair">
            ${this._renderActionButton("Outlet On", "mdi:power-plug", this._findAction("outlet_on"), "positive")}
            ${this._renderActionButton("Outlet Off", "mdi:power-plug-off", this._findAction("outlet_off"), "negative")}
          </div>
        </section>
        <div class="note">Protected actions require confirmation before they run.</div>
        ${this._renderConfirmationDialog()}
      </div>
    `;
  }
  _renderSignal(e, t, i, s, n) {
    return p`<button class=${`signal ${n}`} type="button" data-panel=${e} aria-label=${`${t}: ${i}`} title=${t} @click=${() => this._activePanel = this._activePanel === e ? void 0 : e}>
      <ha-icon .icon=${s}></ha-icon>
      <strong>${i}</strong>
    </button>`;
  }
  _renderPanel(e, t, i, s, n, o) {
    return e === "outlet" ? p`
        <div class="popover">
          <h3>Power Outlet</h3>
          <p>Current outlet status: <strong>${this._outletStatus(t, _(this.hass, this._config?.outlet_entity))}</strong></p>
          <div class="action-pair">
            ${this._renderActionButton("Outlet On", "mdi:power-plug", this._findAction("outlet_on"))}
            ${this._renderActionButton("Outlet Off", "mdi:power-plug-off", this._findAction("outlet_off"))}
          </div>
          <div class="warning">Hard power cuts can cause data loss. Use only when graceful controls are unavailable.</div>
        </div>
      ` : e === "pc" ? p`
        <div class="popover">
          <h3>PC Status</h3>
          <p>Current PC status: <strong>${o}</strong></p>
          <div class="action-pair">
            ${this._renderActionButton("Wake PC", "mdi:power", this._findAction("wake"))}
            ${this._renderActionButton("Shutdown", "mdi:power-off", this._findAction("shutdown"))}
          </div>
          <div class="warning">Shutdown is intended to be graceful and may take time to complete.</div>
        </div>
      ` : p`
      <div class="popover">
        <h3>System Draw</h3>
        <div class="metric-row">
          ${this._renderMetric("Now", this._powerMetric(t, _(this.hass, this._config?.power_entity)))}
          ${this._renderMetric("Today", this._entityMetricValue(i, t, ["today_kwh", "energy_today"]))}
          ${this._renderMetric("Month", this._entityMetricValue(s, t, ["month_kwh", "energy_month"]))}
          ${n ? this._renderMetric("Total", this._entityMetricValue(n, t, ["total_kwh", "energy_total"])) : l}
        </div>
        <div class="trend">${this._metric(t, ["trend", "power_trend"], o)}</div>
      </div>
    `;
  }
  _renderMetric(e, t) {
    const i = typeof t == "string" ? { present: !0, value: t } : t;
    return p`<div class=${`metric${i.present ? "" : " unavailable"}`} aria-disabled=${i.present ? l : "true"}><span>${e}</span><strong>${i.value}</strong></div>`;
  }
  _renderConfirmationDialog() {
    const e = this._pendingConfirmation;
    return e?.confirmation ? p`
      <div class="confirm-backdrop" role="presentation">
        <dialog class="confirm-dialog" open aria-modal="true" aria-labelledby="confirm-title">
          <h3 id="confirm-title">Confirm action</h3>
          <p>${e.confirmation}</p>
          <div class="action-pair">
            <button type="button" data-confirm="cancel" @click=${this._cancelConfirmation}>Cancel</button>
            <button type="button" data-confirm="accept" @click=${this._acceptConfirmation}>Confirm</button>
          </div>
        </dialog>
      </div>
    ` : l;
  }
  _renderActionButton(e, t, i, s) {
    return p`
      <button class=${s ? `action-${s}` : l} type="button" ?disabled=${!this.hass || !i} @click=${() => i && this._handleAction(i)}>
        <ha-icon .icon=${i?.icon ?? t}></ha-icon>
        <span>${i?.label ?? e}</span>
      </button>
    `;
  }
  _findAction(e) {
    const t = this._config?.actions ?? [];
    return t.find((i) => i.key === e) ?? this._findLegacyAction(e, t);
  }
  _findLegacyAction(e, t) {
    const s = {
      wake: ["wake"],
      shutdown: ["shutdown"],
      outlet_on: ["outlet on", "on"],
      outlet_off: ["outlet off", "off"]
    }[e];
    return t.find((n) => s.every((o) => n.label.toLowerCase().includes(o))) ?? t.find((n) => s.some((o) => n.label.toLowerCase().includes(o)));
  }
  _metricValue(e, t, i = "Unavailable") {
    const s = t.map((n) => e?.attributes[n]).find((n) => n != null && n !== "");
    return s === void 0 ? { present: !1, value: i } : { present: !0, value: String(s) };
  }
  _entityMetricValue(e, t, i, s = "Unavailable") {
    if (e && e.state !== "unavailable" && e.state !== "unknown") {
      const n = e.attributes.unit_of_measurement;
      return { present: !0, value: `${e.state}${typeof n == "string" ? ` ${n}` : ""}` };
    }
    return this._metricValue(t, i, s);
  }
  _metric(e, t, i) {
    return this._metricValue(e, t, i).value;
  }
  _outletStatus(e, t) {
    return t?.state ?? this._metric(e, ["outlet_status", "outlet", "power_outlet"], "Unknown");
  }
  _powerMetric(e, t) {
    const i = t?.attributes.unit_of_measurement;
    return t && t.state !== "unavailable" && t.state !== "unknown" ? `${t.state}${typeof i == "string" ? ` ${i}` : ""}` : this._metric(e, ["power", "system_draw", "draw_w"], "— W");
  }
  _entityOnOffState(e) {
    return e ? e.state.toLowerCase() === "on" ? "on" : "off" : "unknown";
  }
  _pcSignalState(e) {
    return e.toLowerCase() === "online" ? "on" : "off";
  }
  _powerSignalState(e) {
    if (!this._config?.power_entity)
      return "unknown";
    if (!e || e.state === "unavailable" || e.state === "unknown")
      return "stale";
    const t = e.last_updated ? Date.parse(e.last_updated) : Number.NaN;
    if (!Number.isFinite(t))
      return "stale";
    const i = 3600 * 1e3;
    return Date.now() - t <= i ? "on" : "stale";
  }
  _thresholds() {
    return {
      idleWatts: this._config?.thresholds?.idleWatts ?? ct.idleWatts,
      activeWatts: this._config?.thresholds?.activeWatts ?? ct.activeWatts
    };
  }
  _statusLabel(e) {
    return {
      outlet_off: "Outlet off",
      online: "Online",
      offline_standby: "Offline",
      booting_or_service_unavailable: "Booting",
      unknown: "Unknown"
    }[e];
  }
  async _handleAction(e) {
    if (this.hass) {
      if (e.confirmation) {
        const t = this._config?.confirmAction;
        if (t) {
          if (!await t(e.confirmation, e)) return;
        } else {
          this._pendingConfirmation = e;
          return;
        }
      }
      await this._callActionService(e);
    }
  }
  async _acceptConfirmation() {
    const e = this._pendingConfirmation;
    this._pendingConfirmation = void 0, e && await this._callActionService(e);
  }
  _cancelConfirmation() {
    this._pendingConfirmation = void 0;
  }
  async _callActionService(e) {
    if (!this.hass) return;
    const t = {
      ...e.service_data ?? {}
    };
    await this.hass.callService(e.domain, e.service, t);
  }
};
b.styles = Qt;
N([
  ft({ attribute: !1 })
], b.prototype, "hass", 2);
N([
  q()
], b.prototype, "_config", 2);
N([
  q()
], b.prototype, "_activePanel", 2);
N([
  q()
], b.prototype, "_pendingConfirmation", 2);
b = N([
  Wt("computer-control-card")
], b);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "computer-control-card",
  name: "Computer Control Card",
  description: "Frontend-only Lovelace card for controlling computers remotely.",
  preview: !0,
  documentationURL: "https://github.com/kevinboone/computer-control-card#readme"
});
export {
  b as ComputerControlCard
};
//# sourceMappingURL=computer-control-card.js.map
