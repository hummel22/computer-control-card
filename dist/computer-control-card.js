const N = globalThis, j = N.ShadowRoot && (N.ShadyCSS === void 0 || N.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, B = /* @__PURE__ */ Symbol(), Z = /* @__PURE__ */ new WeakMap();
let lt = class {
  constructor(t, i, s) {
    if (this._$cssResult$ = !0, s !== B) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (j && t === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (t = Z.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Z.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const _t = (e) => new lt(typeof e == "string" ? e : e + "", void 0, B), mt = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((s, r, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new lt(i, e, B);
}, vt = (e, t) => {
  if (j) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const s = document.createElement("style"), r = N.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, e.appendChild(s);
  }
}, J = j ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const s of t.cssRules) i += s.cssText;
  return _t(i);
})(e) : e;
const { is: $t, defineProperty: gt, getOwnPropertyDescriptor: yt, getOwnPropertyNames: bt, getOwnPropertySymbols: wt, getPrototypeOf: At } = Object, D = globalThis, K = D.trustedTypes, xt = K ? K.emptyScript : "", St = D.reactiveElementPolyfillSupport, C = (e, t) => e, H = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? xt : null;
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
} }, W = (e, t) => !$t(e, t), Y = { attribute: !0, type: String, converter: H, reflect: !1, useDefault: !1, hasChanged: W };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), D.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let w = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Y) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(t, s, i);
      r !== void 0 && gt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    const { get: r, set: n } = yt(this.prototype, t) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: r, set(o) {
      const c = r?.call(this);
      n?.call(this, o), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const t = At(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const i = this.properties, s = [...bt(i), ...wt(i)];
      for (const r of s) this.createProperty(r, i[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [s, r] of i) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const r = this._$Eu(i, s);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) i.unshift(J(r));
    } else t !== void 0 && i.push(J(t));
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
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : H).toAttribute(i, s.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = s.getPropertyOptions(r), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : H;
      this._$Em = r;
      const c = o.fromAttribute(i, n.type);
      this[r] = c ?? this._$Ej?.get(r) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, i, s, r = !1, n) {
    if (t !== void 0) {
      const o = this.constructor;
      if (r === !1 && (n = this[t]), s ??= o.getPropertyOptions(t), !((s.hasChanged ?? W)(n, i) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: s, reflect: r, wrapped: n }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? i ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (i = void 0), this._$AL.set(t, i)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, n] of s) {
        const { wrapped: o } = n, c = this[r];
        o !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, n, c);
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
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[C("elementProperties")] = /* @__PURE__ */ new Map(), w[C("finalized")] = /* @__PURE__ */ new Map(), St?.({ ReactiveElement: w }), (D.reactiveElementVersions ??= []).push("2.1.2");
const I = globalThis, G = (e) => e, R = I.trustedTypes, Q = R ? R.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, dt = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, ht = "?" + v, Ct = `<${ht}>`, y = document, P = () => y.createComment(""), O = (e) => e === null || typeof e != "object" && typeof e != "function", V = Array.isArray, Et = (e) => V(e) || typeof e?.[Symbol.iterator] == "function", z = `[ 	
\f\r]`, S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, X = /-->/g, tt = />/g, $ = RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), et = /'/g, it = /"/g, ut = /^(?:script|style|textarea|title)$/i, Pt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), p = Pt(1), A = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), st = /* @__PURE__ */ new WeakMap(), g = y.createTreeWalker(y, 129);
function pt(e, t) {
  if (!V(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Q !== void 0 ? Q.createHTML(t) : t;
}
const Ot = (e, t) => {
  const i = e.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = S;
  for (let c = 0; c < i; c++) {
    const a = e[c];
    let h, u, l = -1, _ = 0;
    for (; _ < a.length && (o.lastIndex = _, u = o.exec(a), u !== null); ) _ = o.lastIndex, o === S ? u[1] === "!--" ? o = X : u[1] !== void 0 ? o = tt : u[2] !== void 0 ? (ut.test(u[2]) && (r = RegExp("</" + u[2], "g")), o = $) : u[3] !== void 0 && (o = $) : o === $ ? u[0] === ">" ? (o = r ?? S, l = -1) : u[1] === void 0 ? l = -2 : (l = o.lastIndex - u[2].length, h = u[1], o = u[3] === void 0 ? $ : u[3] === '"' ? it : et) : o === it || o === et ? o = $ : o === X || o === tt ? o = S : (o = $, r = void 0);
    const m = o === $ && e[c + 1].startsWith("/>") ? " " : "";
    n += o === S ? a + Ct : l >= 0 ? (s.push(h), a.slice(0, l) + dt + a.slice(l) + v + m) : a + v + (l === -2 ? c : m);
  }
  return [pt(e, n + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class k {
  constructor({ strings: t, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const c = t.length - 1, a = this.parts, [h, u] = Ot(t, i);
    if (this.el = k.createElement(h, s), g.currentNode = this.el.content, i === 2 || i === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (r = g.nextNode()) !== null && a.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const l of r.getAttributeNames()) if (l.endsWith(dt)) {
          const _ = u[o++], m = r.getAttribute(l).split(v), U = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: n, name: U[2], strings: m, ctor: U[1] === "." ? Mt : U[1] === "?" ? Tt : U[1] === "@" ? Ut : L }), r.removeAttribute(l);
        } else l.startsWith(v) && (a.push({ type: 6, index: n }), r.removeAttribute(l));
        if (ut.test(r.tagName)) {
          const l = r.textContent.split(v), _ = l.length - 1;
          if (_ > 0) {
            r.textContent = R ? R.emptyScript : "";
            for (let m = 0; m < _; m++) r.append(l[m], P()), g.nextNode(), a.push({ type: 2, index: ++n });
            r.append(l[_], P());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ht) a.push({ type: 2, index: n });
      else {
        let l = -1;
        for (; (l = r.data.indexOf(v, l + 1)) !== -1; ) a.push({ type: 7, index: n }), l += v.length - 1;
      }
      n++;
    }
  }
  static createElement(t, i) {
    const s = y.createElement("template");
    return s.innerHTML = t, s;
  }
}
function x(e, t, i = e, s) {
  if (t === A) return t;
  let r = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const n = O(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = r : i._$Cl = r), r !== void 0 && (t = x(e, r._$AS(e, t.values), r, s)), t;
}
class kt {
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
    const { el: { content: i }, parts: s } = this._$AD, r = (t?.creationScope ?? y).importNode(i, !0);
    g.currentNode = r;
    let n = g.nextNode(), o = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let h;
        a.type === 2 ? h = new M(n, n.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (h = new Nt(n, this, t)), this._$AV.push(h), a = s[++c];
      }
      o !== a?.index && (n = g.nextNode(), o++);
    }
    return g.currentNode = y, r;
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
  constructor(t, i, s, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = x(this, t, i), O(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Et(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && O(this._$AH) ? this._$AA.nextSibling.data = t : this.T(y.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = k.createElement(pt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const n = new kt(r, this), o = n.u(this.options);
      n.p(i), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let i = st.get(t.strings);
    return i === void 0 && st.set(t.strings, i = new k(t)), i;
  }
  k(t) {
    V(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const n of t) r === i.length ? i.push(s = new M(this.O(P()), this.O(P()), this, this.options)) : s = i[r], s._$AI(n), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const s = G(t).nextSibling;
      G(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class L {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, s, r, n) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(t, i = this, s, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = x(this, t, i, 0), o = !O(t) || t !== this._$AH && t !== A, o && (this._$AH = t);
    else {
      const c = t;
      let a, h;
      for (t = n[0], a = 0; a < n.length - 1; a++) h = x(this, c[s + a], i, a), h === A && (h = this._$AH[a]), o ||= !O(h) || h !== this._$AH[a], h === d ? t = d : t !== d && (t += (h ?? "") + n[a + 1]), this._$AH[a] = h;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Mt extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Tt extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Ut extends L {
  constructor(t, i, s, r, n) {
    super(t, i, s, r, n), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = x(this, t, i, 0) ?? d) === A) return;
    const s = this._$AH, r = t === d && s !== d || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== d && (s === d || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Nt {
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
const Ht = I.litHtmlPolyfillSupport;
Ht?.(k, M), (I.litHtmlVersions ??= []).push("3.3.3");
const Rt = (e, t, i) => {
  const s = i?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = i?.renderBefore ?? null;
    s._$litPart$ = r = new M(t.insertBefore(P(), n), n, void 0, i ?? {});
  }
  return r._$AI(e), r;
};
const F = globalThis;
class E extends w {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Rt(i, this.renderRoot, this.renderOptions);
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
E._$litElement$ = !0, E.finalized = !0, F.litElementHydrateSupport?.({ LitElement: E });
const Dt = F.litElementPolyfillSupport;
Dt?.({ LitElement: E });
(F.litElementVersions ??= []).push("4.2.2");
const Lt = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const zt = { attribute: !0, type: String, converter: H, reflect: !1, hasChanged: W }, jt = (e = zt, t, i) => {
  const { kind: s, metadata: r } = i;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(i.name, e), s === "accessor") {
    const { name: o } = i;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(o, a, e, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(o, void 0, e, c), c;
    } };
  }
  if (s === "setter") {
    const { name: o } = i;
    return function(c) {
      const a = this[o];
      t.call(this, c), this.requestUpdate(o, a, e, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function ft(e) {
  return (t, i) => typeof i == "object" ? jt(e, t, i) : ((s, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, i);
}
function q(e) {
  return ft({ ...e, state: !0, attribute: !1 });
}
const Bt = "Shut down this computer?", Wt = "Turn on the outlet?", It = "Turn off the outlet?", rt = (e, t) => ({
  ...e,
  ...t,
  service_data: {
    ...e.service_data ?? {},
    ...t?.service_data ?? {}
  }
}), Vt = (e) => {
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
    }
  }), e.shutdown_entity && t.push({
    key: "shutdown",
    label: "Shutdown",
    icon: "mdi:power-off",
    domain: "button",
    service: "press",
    service_data: { entity_id: e.shutdown_entity },
    confirmation: Bt
  }), e.outlet_entity && t.push(
    rt(
      {
        key: "outlet_on",
        label: "Outlet On",
        icon: "mdi:power-plug",
        domain: "switch",
        service: "turn_on",
        service_data: { entity_id: e.outlet_entity },
        confirmation: Wt
      },
      e.outlet_actions?.turn_on
    ),
    rt(
      {
        key: "outlet_off",
        label: "Outlet Off",
        icon: "mdi:power-plug-off",
        domain: "switch",
        service: "turn_off",
        service_data: { entity_id: e.outlet_entity },
        confirmation: It
      },
      e.outlet_actions?.turn_off
    )
  ), t;
}, Ft = /* @__PURE__ */ new Set(["unavailable", "unknown"]), nt = (e) => {
  if (typeof e != "string")
    return;
  const t = e.trim().toLowerCase();
  return t.length > 0 ? t : void 0;
}, ot = (e) => !e || Ft.has(e), qt = (e) => {
  if (typeof e == "number")
    return Number.isFinite(e) ? e : void 0;
  if (typeof e == "string" && e.trim().length > 0) {
    const t = Number(e);
    return Number.isFinite(t) ? t : void 0;
  }
}, Zt = (e) => Number.isFinite(e.idleWatts) && Number.isFinite(e.activeWatts), Jt = (e) => {
  const t = nt(e.outletState);
  if (ot(t))
    return "unknown";
  if (t === "off")
    return "outlet_off";
  if (t !== "on")
    return "unknown";
  const i = nt(e.statusState);
  if (ot(i) || !Zt(e.thresholds))
    return "unknown";
  if (i === "on")
    return "online";
  if (i !== "off")
    return "unknown";
  const s = qt(e.powerWatts);
  return s === void 0 ? "unknown" : s < e.thresholds.idleWatts ? "offline_standby" : s > e.thresholds.activeWatts ? "booting_or_service_unavailable" : "unknown";
}, f = (e, t) => {
  if (!(!e || !t))
    return e.states[t];
}, Kt = (e, t) => {
  if (e.name)
    return e.name;
  const i = t?.attributes.friendly_name;
  return typeof i == "string" && i.length > 0 ? i : e.entity ?? "Computer";
}, Yt = mt`
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
var Gt = Object.defineProperty, Qt = Object.getOwnPropertyDescriptor, T = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Qt(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && Gt(t, i, r), r;
};
const at = "custom:computer-control-card", ct = { idleWatts: 10, activeWatts: 40 };
let b = class extends E {
  setConfig(e) {
    if (e.type !== at)
      throw new Error(`Expected card type "${at}".`);
    this._config = {
      ...e,
      variant: e.variant ?? "compact",
      actions: e.actions ?? Vt(e)
    };
  }
  getCardSize() {
    return this._config?.variant === "extended" ? 5 : 3;
  }
  render() {
    if (!this._config)
      return p`<ha-card><div class="empty">Card is not configured.</div></ha-card>`;
    const e = f(this.hass, this._config.entity), t = f(this.hass, this._config.outlet_entity), i = f(this.hass, this._config.status_entity), s = f(this.hass, this._config.power_entity), r = f(this.hass, this._config.energy_today_entity), n = f(this.hass, this._config.energy_month_entity), o = f(this.hass, this._config.energy_total_entity), c = Kt(this._config, e), a = this._statusLabel(Jt({
      outletState: t?.state,
      statusState: i?.state,
      powerWatts: s?.state,
      thresholds: this._thresholds()
    })), h = this._config.variant === "extended" ? "extended" : "compact";
    return p`
      <ha-card header=${this._config.title ?? d} class=${h}>
        ${h === "extended" ? this._renderExtended(e, r, n, o, c, a) : this._renderCompact(e, t, s, r, n, o, c, a)}
      </ha-card>
    `;
  }
  _renderCompact(e, t, i, s, r, n, o, c) {
    return p`
      <div class="compact-shell">
        <div class="compact-header">
          <div class="identity">
            <div class="avatar"><ha-icon icon="mdi:desktop-tower-monitor"></ha-icon></div>
            <div>
              <h2>${o}</h2>
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
          ${this._renderSignal("outlet", "Power Outlet", this._outletStatus(e, t), "mdi:power-plug")}
          ${this._renderSignal("pc", "PC Status", c, "mdi:desktop-tower")}
          ${this._renderSignal("draw", "System Draw", this._powerMetric(e, i), "mdi:flash")}
        </div>
        ${this._activePanel ? this._renderPanel(this._activePanel, e, s, r, n, c) : d}
        ${this._renderConfirmationDialog()}
      </div>
    `;
  }
  _renderExtended(e, t, i, s, r, n) {
    return p`
      <div class="extended-shell">
        <div class="extended-header">
          <div class="identity">
            <div class="avatar"><ha-icon icon="mdi:desktop-tower-monitor"></ha-icon></div>
            <div>
              <h2>${r}</h2>
              <div class="status">${n}</div>
            </div>
          </div>
        </div>
        <div class="status-banner">
          <span>Current status</span>
          <strong>${n}</strong>
        </div>
        <div class="metric-row joined">
          ${this._renderMetric("Outlet", this._outletStatus(e, f(this.hass, this._config?.outlet_entity)))}
          ${this._renderMetric("Today", this._entityMetricValue(t, e, ["today_kwh", "energy_today"]))}
          ${this._renderMetric("Month", this._entityMetricValue(i, e, ["month_kwh", "energy_month"]))}
          ${s ? this._renderMetric("Total", this._entityMetricValue(s, e, ["total_kwh", "energy_total"])) : d}
        </div>
        <section>
          <h3>Machine Actions</h3>
          <div class="action-pair">
            ${this._renderActionButton("Shutdown", "mdi:power-off", this._findAction("shutdown"))}
            ${this._renderActionButton("Wake PC", "mdi:power", this._findAction("wake"))}
          </div>
        </section>
        <section>
          <h3>Power Controls</h3>
          <div class="action-pair">
            ${this._renderActionButton("Outlet On", "mdi:power-plug", this._findAction("outlet_on"))}
            ${this._renderActionButton("Outlet Off", "mdi:power-plug-off", this._findAction("outlet_off"))}
          </div>
        </section>
        <div class="note">Protected actions require confirmation before they run.</div>
        ${this._renderConfirmationDialog()}
      </div>
    `;
  }
  _renderSignal(e, t, i, s) {
    return p`<button class="signal" type="button" data-panel=${e} @click=${() => this._activePanel = this._activePanel === e ? void 0 : e}>
      <ha-icon .icon=${s}></ha-icon>
      <span>${t}</span>
      <strong>${i}</strong>
    </button>`;
  }
  _renderPanel(e, t, i, s, r, n) {
    return e === "outlet" ? p`
        <div class="popover">
          <h3>Power Outlet</h3>
          <p>Current outlet status: <strong>${this._outletStatus(t, f(this.hass, this._config?.outlet_entity))}</strong></p>
          <div class="action-pair">
            ${this._renderActionButton("Outlet On", "mdi:power-plug", this._findAction("outlet_on"))}
            ${this._renderActionButton("Outlet Off", "mdi:power-plug-off", this._findAction("outlet_off"))}
          </div>
          <div class="warning">Hard power cuts can cause data loss. Use only when graceful controls are unavailable.</div>
        </div>
      ` : e === "pc" ? p`
        <div class="popover">
          <h3>PC Status</h3>
          <p>Current PC status: <strong>${n}</strong></p>
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
          ${this._renderMetric("Now", this._powerMetric(t, f(this.hass, this._config?.power_entity)))}
          ${this._renderMetric("Today", this._entityMetricValue(i, t, ["today_kwh", "energy_today"]))}
          ${this._renderMetric("Month", this._entityMetricValue(s, t, ["month_kwh", "energy_month"]))}
          ${r ? this._renderMetric("Total", this._entityMetricValue(r, t, ["total_kwh", "energy_total"])) : d}
        </div>
        <div class="trend">${this._metric(t, ["trend", "power_trend"], n)}</div>
      </div>
    `;
  }
  _renderMetric(e, t) {
    const i = typeof t == "string" ? { present: !0, value: t } : t;
    return p`<div class=${`metric${i.present ? "" : " unavailable"}`} aria-disabled=${i.present ? d : "true"}><span>${e}</span><strong>${i.value}</strong></div>`;
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
  _renderActionButton(e, t, i) {
    return p`
      <button type="button" ?disabled=${!this.hass || !i} @click=${() => i && this._handleAction(i)}>
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
    return t.find((r) => s.every((n) => r.label.toLowerCase().includes(n))) ?? t.find((r) => s.some((n) => r.label.toLowerCase().includes(n)));
  }
  _metricValue(e, t, i = "Unavailable") {
    const s = t.map((r) => e?.attributes[r]).find((r) => r != null && r !== "");
    return s === void 0 ? { present: !1, value: i } : { present: !0, value: String(s) };
  }
  _entityMetricValue(e, t, i, s = "Unavailable") {
    if (e && e.state !== "unavailable" && e.state !== "unknown") {
      const r = e.attributes.unit_of_measurement;
      return { present: !0, value: `${e.state}${typeof r == "string" ? ` ${r}` : ""}` };
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
      offline_standby: "Offline standby",
      booting_or_service_unavailable: "Booting or service unavailable",
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
b.styles = Yt;
T([
  ft({ attribute: !1 })
], b.prototype, "hass", 2);
T([
  q()
], b.prototype, "_config", 2);
T([
  q()
], b.prototype, "_activePanel", 2);
T([
  q()
], b.prototype, "_pendingConfirmation", 2);
b = T([
  Lt("computer-control-card")
], b);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "computer-control-card",
  name: "Computer Control Card",
  description: "Frontend-only Lovelace card for controlling computers remotely.",
  preview: !0
});
export {
  b as ComputerControlCard
};
//# sourceMappingURL=computer-control-card.js.map
