const U = globalThis, D = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, j = /* @__PURE__ */ Symbol(), G = /* @__PURE__ */ new WeakMap();
let dt = class {
  constructor(t, i, n) {
    if (this._$cssResult$ = !0, n !== j) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (D && t === void 0) {
      const n = i !== void 0 && i.length === 1;
      n && (t = G.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && G.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const mt = (e) => new dt(typeof e == "string" ? e : e + "", void 0, j), gt = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((n, s, o) => n + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[o + 1], e[0]);
  return new dt(i, e, j);
}, yt = (e, t) => {
  if (D) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const n = document.createElement("style"), s = U.litNonce;
    s !== void 0 && n.setAttribute("nonce", s), n.textContent = i.cssText, e.appendChild(n);
  }
}, Y = D ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const n of t.cssRules) i += n.cssText;
  return mt(i);
})(e) : e;
const { is: bt, defineProperty: vt, getOwnPropertyDescriptor: $t, getOwnPropertyNames: wt, getOwnPropertySymbols: At, getPrototypeOf: xt } = Object, L = globalThis, K = L.trustedTypes, St = K ? K.emptyScript : "", Ct = L.reactiveElementPolyfillSupport, C = (e, t) => e, H = { toAttribute(e, t) {
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
} }, I = (e, t) => !bt(e, t), Z = { attribute: !0, type: String, converter: H, reflect: !1, useDefault: !1, hasChanged: I };
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
      const n = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(t, n, i);
      s !== void 0 && vt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, i, n) {
    const { get: s, set: o } = $t(this.prototype, t) ?? { get() {
      return this[i];
    }, set(r) {
      this[i] = r;
    } };
    return { get: s, set(r) {
      const c = s?.call(this);
      o?.call(this, r), this.requestUpdate(t, c, n);
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
      const i = this.properties, n = [...wt(i), ...At(i)];
      for (const s of n) this.createProperty(s, i[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [n, s] of i) this.elementProperties.set(n, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, n] of this.elementProperties) {
      const s = this._$Eu(i, n);
      s !== void 0 && this._$Eh.set(s, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const n = new Set(t.flat(1 / 0).reverse());
      for (const s of n) i.unshift(Y(s));
    } else t !== void 0 && i.push(Y(t));
    return i;
  }
  static _$Eu(t, i) {
    const n = i.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const n of i.keys()) this.hasOwnProperty(n) && (t.set(n, this[n]), delete this[n]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return yt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, n) {
    this._$AK(t, n);
  }
  _$ET(t, i) {
    const n = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, n);
    if (s !== void 0 && n.reflect === !0) {
      const o = (n.converter?.toAttribute !== void 0 ? n.converter : H).toAttribute(i, n.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const n = this.constructor, s = n._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const o = n.getPropertyOptions(s), r = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : H;
      this._$Em = s;
      const c = r.fromAttribute(i, o.type);
      this[s] = c ?? this._$Ej?.get(s) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, i, n, s = !1, o) {
    if (t !== void 0) {
      const r = this.constructor;
      if (s === !1 && (o = this[t]), n ??= r.getPropertyOptions(t), !((n.hasChanged ?? I)(o, i) || n.useDefault && n.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, n)))) return;
      this.C(t, i, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: n, reflect: s, wrapped: o }, r) {
    n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? i ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || n || (i = void 0), this._$AL.set(t, i)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [s, o] of n) {
        const { wrapped: r } = o, c = this[s];
        r !== !0 || this._$AL.has(s) || c === void 0 || this.C(s, void 0, o, c);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((n) => n.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (n) {
      throw t = !1, this._$EM(), n;
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
const B = globalThis, J = (e) => e, R = B.trustedTypes, Q = R ? R.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ht = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, ut = "?" + g, Ot = `<${ut}>`, v = document, E = () => v.createComment(""), k = (e) => e === null || typeof e != "object" && typeof e != "function", F = Array.isArray, Et = (e) => F(e) || typeof e?.[Symbol.iterator] == "function", z = `[ 	
\f\r]`, S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, X = /-->/g, tt = />/g, y = RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), et = /'/g, it = /"/g, pt = /^(?:script|style|textarea|title)$/i, kt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), p = kt(1), A = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), nt = /* @__PURE__ */ new WeakMap(), b = v.createTreeWalker(v, 129);
function _t(e, t) {
  if (!F(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Q !== void 0 ? Q.createHTML(t) : t;
}
const Pt = (e, t) => {
  const i = e.length - 1, n = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = S;
  for (let c = 0; c < i; c++) {
    const a = e[c];
    let h, u, l = -1, f = 0;
    for (; f < a.length && (r.lastIndex = f, u = r.exec(a), u !== null); ) f = r.lastIndex, r === S ? u[1] === "!--" ? r = X : u[1] !== void 0 ? r = tt : u[2] !== void 0 ? (pt.test(u[2]) && (s = RegExp("</" + u[2], "g")), r = y) : u[3] !== void 0 && (r = y) : r === y ? u[0] === ">" ? (r = s ?? S, l = -1) : u[1] === void 0 ? l = -2 : (l = r.lastIndex - u[2].length, h = u[1], r = u[3] === void 0 ? y : u[3] === '"' ? it : et) : r === it || r === et ? r = y : r === X || r === tt ? r = S : (r = y, s = void 0);
    const m = r === y && e[c + 1].startsWith("/>") ? " " : "";
    o += r === S ? a + Ot : l >= 0 ? (n.push(h), a.slice(0, l) + ht + a.slice(l) + g + m) : a + g + (l === -2 ? c : m);
  }
  return [_t(e, o + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), n];
};
class P {
  constructor({ strings: t, _$litType$: i }, n) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const c = t.length - 1, a = this.parts, [h, u] = Pt(t, i);
    if (this.el = P.createElement(h, n), b.currentNode = this.el.content, i === 2 || i === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (s = b.nextNode()) !== null && a.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const l of s.getAttributeNames()) if (l.endsWith(ht)) {
          const f = u[r++], m = s.getAttribute(l).split(g), T = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: o, name: T[2], strings: m, ctor: T[1] === "." ? Nt : T[1] === "?" ? Tt : T[1] === "@" ? Ut : W }), s.removeAttribute(l);
        } else l.startsWith(g) && (a.push({ type: 6, index: o }), s.removeAttribute(l));
        if (pt.test(s.tagName)) {
          const l = s.textContent.split(g), f = l.length - 1;
          if (f > 0) {
            s.textContent = R ? R.emptyScript : "";
            for (let m = 0; m < f; m++) s.append(l[m], E()), b.nextNode(), a.push({ type: 2, index: ++o });
            s.append(l[f], E());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ut) a.push({ type: 2, index: o });
      else {
        let l = -1;
        for (; (l = s.data.indexOf(g, l + 1)) !== -1; ) a.push({ type: 7, index: o }), l += g.length - 1;
      }
      o++;
    }
  }
  static createElement(t, i) {
    const n = v.createElement("template");
    return n.innerHTML = t, n;
  }
}
function x(e, t, i = e, n) {
  if (t === A) return t;
  let s = n !== void 0 ? i._$Co?.[n] : i._$Cl;
  const o = k(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== o && (s?._$AO?.(!1), o === void 0 ? s = void 0 : (s = new o(e), s._$AT(e, i, n)), n !== void 0 ? (i._$Co ??= [])[n] = s : i._$Cl = s), s !== void 0 && (t = x(e, s._$AS(e, t.values), s, n)), t;
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
    const { el: { content: i }, parts: n } = this._$AD, s = (t?.creationScope ?? v).importNode(i, !0);
    b.currentNode = s;
    let o = b.nextNode(), r = 0, c = 0, a = n[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let h;
        a.type === 2 ? h = new M(o, o.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (h = new Ht(o, this, t)), this._$AV.push(h), a = n[++c];
      }
      r !== a?.index && (o = b.nextNode(), r++);
    }
    return b.currentNode = v, s;
  }
  p(t) {
    let i = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(t, n, i), i += n.strings.length - 2) : n._$AI(t[i])), i++;
  }
}
class M {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, n, s) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = n, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    t = x(this, t, i), k(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Et(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && k(this._$AH) ? this._$AA.nextSibling.data = t : this.T(v.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: n } = t, s = typeof n == "number" ? this._$AC(t) : (n.el === void 0 && (n.el = P.createElement(_t(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === s) this._$AH.p(i);
    else {
      const o = new Mt(s, this), r = o.u(this.options);
      o.p(i), this.T(r), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = nt.get(t.strings);
    return i === void 0 && nt.set(t.strings, i = new P(t)), i;
  }
  k(t) {
    F(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let n, s = 0;
    for (const o of t) s === i.length ? i.push(n = new M(this.O(E()), this.O(E()), this, this.options)) : n = i[s], n._$AI(o), s++;
    s < i.length && (this._$AR(n && n._$AB.nextSibling, s), i.length = s);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const n = J(t).nextSibling;
      J(t).remove(), t = n;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class W {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, n, s, o) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = i, this._$AM = s, this.options = o, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = d;
  }
  _$AI(t, i = this, n, s) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = x(this, t, i, 0), r = !k(t) || t !== this._$AH && t !== A, r && (this._$AH = t);
    else {
      const c = t;
      let a, h;
      for (t = o[0], a = 0; a < o.length - 1; a++) h = x(this, c[n + a], i, a), h === A && (h = this._$AH[a]), r ||= !k(h) || h !== this._$AH[a], h === d ? t = d : t !== d && (t += (h ?? "") + o[a + 1]), this._$AH[a] = h;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Nt extends W {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Tt extends W {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Ut extends W {
  constructor(t, i, n, s, o) {
    super(t, i, n, s, o), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = x(this, t, i, 0) ?? d) === A) return;
    const n = this._$AH, s = t === d && n !== d || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive, o = t !== d && (n === d || s);
    s && this.element.removeEventListener(this.name, this, n), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ht {
  constructor(t, i, n) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = n;
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
  const n = i?.renderBefore ?? t;
  let s = n._$litPart$;
  if (s === void 0) {
    const o = i?.renderBefore ?? null;
    n._$litPart$ = s = new M(t.insertBefore(E(), o), o, void 0, i ?? {});
  }
  return s._$AI(e), s;
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
const Wt = V.litElementPolyfillSupport;
Wt?.({ LitElement: O });
(V.litElementVersions ??= []).push("4.2.2");
const zt = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const Dt = { attribute: !0, type: String, converter: H, reflect: !1, hasChanged: I }, jt = (e = Dt, t, i) => {
  const { kind: n, metadata: s } = i;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), n === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(i.name, e), n === "accessor") {
    const { name: r } = i;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(r, a, e, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, e, c), c;
    } };
  }
  if (n === "setter") {
    const { name: r } = i;
    return function(c) {
      const a = this[r];
      t.call(this, c), this.requestUpdate(r, a, e, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function ft(e) {
  return (t, i) => typeof i == "object" ? jt(e, t, i) : ((n, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, n), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(e, t, i);
}
function q(e) {
  return ft({ ...e, state: !0, attribute: !1 });
}
const It = "Wake this computer?", Bt = "Shut down this computer?", Ft = "Turn on the outlet?", Vt = "Turn off the outlet?", st = (e, t) => ({
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
    st(
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
    st(
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
  const n = Yt(e.powerWatts);
  return n === void 0 ? "unknown" : n < e.thresholds.idleWatts ? "offline_standby" : n > e.thresholds.activeWatts ? "booting_or_service_unavailable" : "unknown";
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

  .signal.selected {
    background: color-mix(in srgb, var(--primary-color) 18%, var(--secondary-background-color, #f4f4f4));
    border-color: color-mix(in srgb, var(--primary-color) 42%, var(--divider-color));
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

  .status-banner,
  .metric,
  section,
  .note {
    background: var(--secondary-background-color, #f4f4f4);
    border: 1px solid var(--divider-color, transparent);
    border-radius: 18px;
    padding: 14px;
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
    align-items: flex-start;
    display: grid;
    gap: 6px;
    justify-content: stretch;
    min-height: 74px;
    text-align: left;
  }

  .metric.history-metric::after {
    color: var(--secondary-text-color);
    content: 'History';
    font-size: 11px;
  }

  .bubble-panel {
    gap: 12px;
    min-height: 150px;
  }

  .bubble-panel-heading {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .bubble-panel-heading span {
    color: var(--secondary-text-color);
    font-size: 13px;
    text-transform: capitalize;
  }

  .bubble-grid {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .power-bubbles {
    grid-template-columns: repeat(3, minmax(0, 1fr));
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

  button.metric:disabled {
    cursor: default;
    opacity: 1;
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
    .metric-row,
    .bubble-grid,
    .power-bubbles {
      grid-template-columns: 1fr;
    }
  }
`;
var Xt = Object.defineProperty, te = Object.getOwnPropertyDescriptor, N = (e, t, i, n) => {
  for (var s = n > 1 ? void 0 : n ? te(t, i) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = (n ? r(t, i, s) : r(s)) || s);
  return n && s && Xt(t, i, s), s;
};
const at = "custom:computer-control-card", ct = { idleWatts: 10, activeWatts: 40 }, lt = {
  compact: { columns: 6, rows: 8, cardSize: 8 },
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
}, ne = [
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
let $ = class extends O {
  constructor() {
    super(...arguments), this._activePanel = "draw";
  }
  static getConfigForm() {
    return {
      schema: ne,
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
    const e = _(this.hass, this._config.entity), t = _(this.hass, this._config.outlet_entity), i = _(this.hass, this._config.status_entity), n = _(this.hass, this._config.power_entity), s = _(this.hass, this._config.energy_today_entity), o = _(this.hass, this._config.energy_month_entity), r = _(this.hass, this._config.energy_total_entity), c = Jt(this._config, e), a = this._statusLabel(Zt({
      outletState: t?.state,
      statusState: i?.state,
      powerWatts: n?.state,
      thresholds: this._thresholds()
    })), h = this._config.variant === "extended" ? "extended" : "compact";
    return p`
      <ha-card header=${this._config.title ?? d} class=${h}>
        ${h === "extended" ? this._renderExtended(e, s, o, r, c, a) : this._renderCompact(e, t, n, s, o, r, c, a)}
      </ha-card>
    `;
  }
  _layout() {
    return this._config?.variant === "extended" ? lt.extended : lt.compact;
  }
  _renderCompact(e, t, i, n, s, o, r, c) {
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
        ${this._renderPanel(this._activePanel, e, n, s, o, c)}
        ${this._renderConfirmationDialog()}
      </div>
    `;
  }
  _renderExtended(e, t, i, n, s, o) {
    return p`
      <div class="extended-shell">
        <div class="extended-header">
          <div class="identity">
            <div class="avatar"><ha-icon icon="mdi:desktop-tower-monitor"></ha-icon></div>
            <div>
              <h2>${s}</h2>
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
          ${n ? this._renderMetric("Total", this._entityMetricValue(n, e, ["total_kwh", "energy_total"])) : d}
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
  _renderSignal(e, t, i, n, s) {
    return p`<button class=${`signal ${s}${this._activePanel === e ? " selected" : ""}`} type="button" data-panel=${e} aria-label=${`${t}: ${i}`} title=${t} aria-pressed=${this._activePanel === e} @click=${() => this._activePanel = e}>
      <ha-icon .icon=${n}></ha-icon>
      <strong>${i}</strong>
    </button>`;
  }
  _renderPanel(e, t, i, n, s, o) {
    return e === "outlet" ? p`
        <section class="bubble-panel" aria-live="polite">
          <div class="bubble-panel-heading">
            <h3>Power Outlet</h3>
            <span>${this._outletStatus(t, _(this.hass, this._config?.outlet_entity))}</span>
          </div>
          <div class="bubble-grid">
            ${this._renderActionButton("Outlet On", "mdi:power-plug", this._findAction("outlet_on"))}
            ${this._renderActionButton("Outlet Off", "mdi:power-plug-off", this._findAction("outlet_off"))}
          </div>
          <div class="warning">Hard power cuts can cause data loss.</div>
        </section>
      ` : e === "pc" ? p`
        <section class="bubble-panel" aria-live="polite">
          <div class="bubble-panel-heading">
            <h3>PC Status</h3>
            <span>${o}</span>
          </div>
          <div class="bubble-grid">
            ${this._renderActionButton("Wake PC", "mdi:power", this._findAction("wake"))}
            ${this._renderActionButton("Shutdown", "mdi:power-off", this._findAction("shutdown"))}
          </div>
          <div class="warning">Shutdown is intended to be graceful and may take time to complete.</div>
        </section>
      ` : p`
      <section class="bubble-panel" aria-live="polite">
        <div class="bubble-panel-heading">
          <h3>Power</h3>
          <span>${this._metric(t, ["trend", "power_trend"], o)}</span>
        </div>
        <div class="bubble-grid power-bubbles">
          ${this._renderMetric("Now", this._powerMetric(t, _(this.hass, this._config?.power_entity)), this._config?.power_entity)}
          ${this._renderMetric("Today", this._entityMetricValue(i, t, ["today_kwh", "energy_today"]), this._config?.energy_today_entity)}
          ${this._renderMetric("Month", this._entityMetricValue(n, t, ["month_kwh", "energy_month"]), this._config?.energy_month_entity)}
          ${s ? this._renderMetric("Total", this._entityMetricValue(s, t, ["total_kwh", "energy_total"]), this._config?.energy_total_entity) : d}
        </div>
      </section>
    `;
  }
  _renderMetric(e, t, i) {
    const n = typeof t == "string" ? { present: !0, value: t } : t, s = !!(i && n.present);
    return p`<button class=${`metric${n.present ? "" : " unavailable"}${s ? " history-metric" : ""}`} type="button" ?disabled=${!s} aria-disabled=${n.present ? d : "true"} @click=${() => i && n.present && this._showMoreInfo(i)}><span>${e}</span><strong>${n.value}</strong></button>`;
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
    ` : d;
  }
  _renderActionButton(e, t, i, n) {
    return p`
      <button class=${n ? `action-${n}` : d} type="button" ?disabled=${!this.hass || !i} @click=${() => i && this._handleAction(i)}>
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
    const n = {
      wake: ["wake"],
      shutdown: ["shutdown"],
      outlet_on: ["outlet on", "on"],
      outlet_off: ["outlet off", "off"]
    }[e];
    return t.find((s) => n.every((o) => s.label.toLowerCase().includes(o))) ?? t.find((s) => n.some((o) => s.label.toLowerCase().includes(o)));
  }
  _metricValue(e, t, i = "Unavailable") {
    const n = t.map((s) => e?.attributes[s]).find((s) => s != null && s !== "");
    return n === void 0 ? { present: !1, value: i } : { present: !0, value: String(n) };
  }
  _entityMetricValue(e, t, i, n = "Unavailable") {
    if (e && e.state !== "unavailable" && e.state !== "unknown") {
      const s = e.attributes.unit_of_measurement;
      return { present: !0, value: `${e.state}${typeof s == "string" ? ` ${s}` : ""}` };
    }
    return this._metricValue(t, i, n);
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
  _showMoreInfo(e) {
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      bubbles: !0,
      composed: !0,
      detail: { entityId: e }
    }));
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
$.styles = Qt;
N([
  ft({ attribute: !1 })
], $.prototype, "hass", 2);
N([
  q()
], $.prototype, "_config", 2);
N([
  q()
], $.prototype, "_activePanel", 2);
N([
  q()
], $.prototype, "_pendingConfirmation", 2);
$ = N([
  zt("computer-control-card")
], $);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "computer-control-card",
  name: "Computer Control Card",
  description: "Frontend-only Lovelace card for controlling computers remotely.",
  preview: !0,
  documentationURL: "https://github.com/kevinboone/computer-control-card#readme"
});
export {
  $ as ComputerControlCard
};
//# sourceMappingURL=computer-control-card.js.map
