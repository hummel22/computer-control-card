import '../src/computer-control-card';
import { fixtures, type FixtureKey, PRIMARY_ENTITY, OUTLET_ENTITY, STATUS_ENTITY, POWER_ENTITY, ENERGY_TODAY_ENTITY, ENERGY_MONTH_ENTITY } from './fixtures';
import { createMockHass, serviceCalls, type DemoHomeAssistant, type ServiceCallLogEntry } from './mock-hass';
import './styles.css';
import type { ComputerControlCardConfig, LovelaceCard } from '../src/types';

class HaCard extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>:host{display:block;background:var(--card-background-color,#fff);border-radius:var(--ha-card-border-radius,12px);box-shadow:var(--ha-card-box-shadow,0 2px 8px rgb(0 0 0 / 18%));color:var(--primary-text-color,#212121)}.header{font:600 18px system-ui;padding:16px 16px 0}::slotted(*){box-sizing:border-box}</style><div class="header"></div><slot></slot>`;
    }
    const header = this.getAttribute('header');
    this.shadowRoot!.querySelector('.header')!.textContent = header ?? '';
  }
}

class HaIcon extends HTMLElement {
  static get observedAttributes() { return ['icon']; }
  set icon(value: string) { this.setAttribute('icon', value); }
  get icon() { return this.getAttribute('icon') ?? ''; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() { this.textContent = this.icon.replace('mdi:', ''); }
}

customElements.define('ha-card', HaCard);
customElements.define('ha-icon', HaIcon);

const logEl = document.querySelector<HTMLDivElement>('[data-service-log]')!;
const fixtureSelect = document.querySelector<HTMLSelectElement>('[data-fixture]')!;
const themeToggle = document.querySelector<HTMLInputElement>('[data-theme-toggle]')!;

let hass: DemoHomeAssistant;
const cards: LovelaceCard[] = [];

const baseConfig = (variant: 'compact' | 'extended'): ComputerControlCardConfig => ({
  type: 'custom:computer-control-card',
  title: `${variant === 'compact' ? 'Compact' : 'Extended'} Computer Control`,
  entity: PRIMARY_ENTITY,
  wol_mac: 'AA:BB:CC:DD:EE:FF',
  broadcast_address: '192.168.1.255',
  shutdown_entity: 'button.demo_pc_shutdown',
  outlet_entity: OUTLET_ENTITY,
  outlet_actions: {
    turn_on: { key: 'outlet_on', confirmation: 'Turn on the outlet?' },
    turn_off: { key: 'outlet_off', confirmation: 'Turn off the outlet?' },
  },
  status_entity: STATUS_ENTITY,
  power_entity: POWER_ENTITY,
  energy_today_entity: ENERGY_TODAY_ENTITY,
  energy_month_entity: ENERGY_MONTH_ENTITY,
  thresholds: { idleWatts: 10, activeWatts: 40 },
  name: 'Studio Workstation',
  variant,
});

const appendLog = (entry: ServiceCallLogEntry) => {
  const row = document.createElement('li');
  row.dataset.serviceCall = `${entry.domain}.${entry.service}`;
  row.textContent = `${entry.timestamp} ${entry.domain}.${entry.service} ${JSON.stringify(entry.serviceData ?? {})}`;
  logEl.prepend(row);
};

const renderCards = () => {
  document.querySelectorAll<HTMLElement>('[data-card-host]').forEach((host) => {
    host.replaceChildren();
    (['compact', 'extended'] as const).forEach((variant) => {
      const card = document.createElement('computer-control-card') as LovelaceCard;
      card.setConfig(baseConfig(variant));
      card.hass = hass;
      card.dataset.variant = variant;
      host.append(card);
      cards.push(card);
    });
  });
};

const applyFixture = (fixture: FixtureKey) => {
  hass.setStates(fixtures[fixture]);
  cards.forEach((card) => { card.hass = { ...hass }; });
  document.body.dataset.fixture = fixture;
};

hass = createMockHass(fixtures.online, appendLog);
window.computerControlDemoCalls = serviceCalls;
renderCards();

fixtureSelect.addEventListener('change', () => applyFixture(fixtureSelect.value as FixtureKey));
themeToggle.addEventListener('change', () => {
  document.documentElement.dataset.theme = themeToggle.checked ? 'dark' : 'light';
});

document.querySelectorAll<HTMLButtonElement>('[data-open-panel]').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = button.dataset.openPanel;
    document.querySelector<HTMLElement>('[data-card-host="dashboard-medium"] computer-control-card[data-variant="compact"]')
      ?.shadowRoot?.querySelector<HTMLButtonElement>(`[data-panel="${panel}"]`)?.click();
  });
});
