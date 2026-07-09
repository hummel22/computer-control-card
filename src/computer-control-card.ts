import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { buildDefaultActions } from './actions';
import { deriveComputerState, getDisplayName, getEntity } from './state';
import { styles } from './styles';
import type { ComputerControlActionConfig, ComputerControlActionKey, ComputerControlCardConfig, ComputerControlConfirmationHandler, HassEntity, HomeAssistant, HomeAssistantConfigForm, HomeAssistantFormSchema, LovelaceCardConfig, LovelaceGridOptions } from './types';

const CARD_TYPE = 'custom:computer-control-card';
const DEFAULT_THRESHOLDS = { idleWatts: 10, activeWatts: 40 };
const CARD_LAYOUT = {
  compact: { columns: 6, rows: 4, cardSize: 4 },
  extended: { columns: 12, rows: 11, cardSize: 11 },
} as const;

const CONFIG_FORM_LABELS: Record<string, string> = {
  title: 'Card header',
  name: 'Computer name',
  entity: 'Summary entity',
  status_entity: 'Status entity',
  power_entity: 'Power entity',
  energy_today_entity: 'Energy today entity',
  energy_month_entity: 'Energy month entity',
  energy_total_entity: 'Energy total entity',
  wol_mac: 'Wake-on-LAN MAC address',
  broadcast_address: 'Wake-on-LAN broadcast address',
  shutdown_entity: 'Shutdown button entity',
  outlet_entity: 'Outlet switch entity',
  variant: 'Layout variant',
  thresholds: 'Power thresholds',
  idleWatts: 'Idle watts',
  activeWatts: 'Active watts',
  outlet_actions: 'Generated outlet action overrides',
  actions: 'Fully custom action list',
};

const CONFIG_FORM_HELPERS: Record<string, string> = {
  entity: 'Main entity used for the display state and fallback metric attributes.',
  status_entity: 'Optional online/status entity, for example a binary sensor.',
  power_entity: 'Optional current power draw sensor, usually measured in watts.',
  energy_today_entity: 'Optional daily energy sensor. If unset, the card falls back to summary attributes.',
  energy_month_entity: 'Optional monthly energy sensor. If unset, the card falls back to summary attributes.',
  energy_total_entity: 'Optional lifetime/total energy sensor.',
  wol_mac: 'Optional MAC address used to generate the Wake PC action.',
  broadcast_address: 'Optional broadcast address for wake_on_lan.send_magic_packet.',
  shutdown_entity: 'Optional button entity used to generate a protected shutdown action.',
  outlet_entity: 'Optional switch entity used to generate protected outlet on/off actions.',
  thresholds: 'Optional values used with status and power entities to derive standby, online, and booting states.',
  outlet_actions: 'Optional YAML object for turn_on/turn_off overrides such as icon, label, service_data, or confirmation.',
  actions: 'Optional YAML array of complete custom actions. When supplied, it replaces generated actions.',
};

const CONFIG_FORM_SCHEMA: HomeAssistantFormSchema[] = [
  { name: 'title', selector: { text: {} } },
  { name: 'name', selector: { text: {} } },
  { name: 'entity', selector: { entity: {} } },
  { name: 'status_entity', selector: { entity: {} } },
  { name: 'power_entity', selector: { entity: { domain: 'sensor' } } },
  { name: 'energy_today_entity', selector: { entity: { domain: 'sensor' } } },
  { name: 'energy_month_entity', selector: { entity: { domain: 'sensor' } } },
  { name: 'energy_total_entity', selector: { entity: { domain: 'sensor' } } },
  { name: 'wol_mac', selector: { text: {} } },
  { name: 'broadcast_address', selector: { text: {} } },
  { name: 'shutdown_entity', selector: { entity: { domain: 'button' } } },
  { name: 'outlet_entity', selector: { entity: { domain: 'switch' } } },
  {
    name: 'variant',
    selector: {
      select: {
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Extended', value: 'extended' },
        ],
      },
    },
  },
  {
    type: 'grid',
    name: 'thresholds',
    schema: [
      { name: 'idleWatts', selector: { number: { min: 0, mode: 'box', step: 1, unit_of_measurement: 'W' } } },
      { name: 'activeWatts', selector: { number: { min: 0, mode: 'box', step: 1, unit_of_measurement: 'W' } } },
    ],
  },
  { name: 'outlet_actions', selector: { object: {} } },
  { name: 'actions', selector: { object: {} } },
];
type PanelKey = 'outlet' | 'pc' | 'draw';
type SignalState = 'on' | 'off' | 'stale' | 'unknown';
type ActionTone = 'positive' | 'negative';
type MetricValue = { present: true; value: string } | { present: false; value: string };

@customElement('computer-control-card')
export class ComputerControlCard extends LitElement {
  static override styles = styles;

  public static getConfigForm(): HomeAssistantConfigForm {
    return {
      schema: CONFIG_FORM_SCHEMA,
      computeLabel: (schema) => CONFIG_FORM_LABELS[schema.name],
      computeHelper: (schema) => CONFIG_FORM_HELPERS[schema.name],
    };
  }

  public static getStubConfig(): Omit<ComputerControlCardConfig, 'type'> {
    return {
      name: 'Computer',
      variant: 'compact',
    };
  }

  @property({ attribute: false })
  public hass?: HomeAssistant;

  @state()
  private _config?: ComputerControlCardConfig;

  @state()
  private _activePanel: PanelKey = 'draw';

  @state()
  private _pendingConfirmation: ComputerControlActionConfig | undefined;

  public setConfig(config: LovelaceCardConfig): void {
    if (config.type !== CARD_TYPE) {
      throw new Error(`Expected card type "${CARD_TYPE}".`);
    }

    this._config = {
      ...config,
      variant: (config as ComputerControlCardConfig).variant ?? 'compact',
      actions: (config as ComputerControlCardConfig).actions ?? buildDefaultActions(config as ComputerControlCardConfig),
    } as ComputerControlCardConfig;
  }

  public getCardSize(): number {
    return this._layout().cardSize;
  }

  public getGridOptions(): LovelaceGridOptions {
    const { columns, rows } = this._layout();
    return { columns, rows };
  }

  protected override render() {
    if (!this._config) {
      return html`<ha-card><div class="empty">Card is not configured.</div></ha-card>`;
    }

    const entity = getEntity(this.hass, this._config.entity);
    const outletEntity = getEntity(this.hass, this._config.outlet_entity);
    const statusEntity = getEntity(this.hass, this._config.status_entity);
    const powerEntity = getEntity(this.hass, this._config.power_entity);
    const energyTodayEntity = getEntity(this.hass, this._config.energy_today_entity);
    const energyMonthEntity = getEntity(this.hass, this._config.energy_month_entity);
    const energyTotalEntity = getEntity(this.hass, this._config.energy_total_entity);
    const displayName = getDisplayName(this._config, entity);
    const status = this._statusLabel(deriveComputerState({
      outletState: outletEntity?.state,
      statusState: statusEntity?.state,
      powerWatts: powerEntity?.state,
      thresholds: this._thresholds(),
    }));
    const variant = this._config.variant === 'extended' ? 'extended' : 'compact';

    return html`
      <ha-card header=${this._config.title ?? nothing} class=${variant}>
        ${variant === 'extended'
          ? this._renderExtended(entity, energyTodayEntity, energyMonthEntity, energyTotalEntity, displayName, status)
          : this._renderCompact(entity, outletEntity, powerEntity, energyTodayEntity, energyMonthEntity, energyTotalEntity, displayName, status)}
      </ha-card>
    `;
  }

  private _layout() {
    if (this._config?.variant === 'extended') {
      return CARD_LAYOUT.extended;
    }

    return {
      ...CARD_LAYOUT.compact,
      rows: this._config?.title ? 5 : CARD_LAYOUT.compact.rows,
      cardSize: this._config?.title ? 5 : CARD_LAYOUT.compact.cardSize,
    };
  }

  private _renderCompact(
    entity: HassEntity | undefined,
    outletEntity: HassEntity | undefined,
    powerEntity: HassEntity | undefined,
    energyTodayEntity: HassEntity | undefined,
    energyMonthEntity: HassEntity | undefined,
    energyTotalEntity: HassEntity | undefined,
    displayName: string,
    status: string,
  ) {
    return html`
      <div class="compact-shell">
        <div class="compact-header">
          <div class="identity">
            <div class="avatar"><ha-icon icon="mdi:desktop-tower-monitor"></ha-icon></div>
            <div>
              <h2>${displayName}</h2>
              <div class="subtle">Remote computer</div>
            </div>
          </div>
          <div class="header-trailing">
            <span class="status-pill">${status}</span>
            <button class="icon-button" type="button" aria-label="More options">
              <ha-icon icon="mdi:dots-vertical"></ha-icon>
            </button>
          </div>
        </div>
        <div class="signal-row">
          ${this._renderSignal('outlet', 'Power Outlet', this._outletStatus(entity, outletEntity), 'mdi:power-plug', this._entityOnOffState(outletEntity))}
          ${this._renderSignal('pc', 'PC Status', status, 'mdi:desktop-tower', this._pcSignalState(status))}
          ${this._renderSignal('draw', 'System Draw', this._powerMetric(entity, powerEntity), 'mdi:flash', this._powerSignalState(powerEntity))}
        </div>
        ${this._renderPanel(this._activePanel, entity, energyTodayEntity, energyMonthEntity)}
        ${this._renderConfirmationDialog()}
      </div>
    `;
  }

  private _renderExtended(
    entity: HassEntity | undefined,
    energyTodayEntity: HassEntity | undefined,
    energyMonthEntity: HassEntity | undefined,
    energyTotalEntity: HassEntity | undefined,
    displayName: string,
    status: string,
  ) {
    return html`
      <div class="extended-shell">
        <div class="extended-header">
          <div class="identity">
            <div class="avatar"><ha-icon icon="mdi:desktop-tower-monitor"></ha-icon></div>
            <div>
              <h2>${displayName}</h2>
              <div class="status">${status}</div>
            </div>
          </div>
        </div>
        <div class="status-banner">
          <span>Current status</span>
          <strong>${status}</strong>
        </div>
        <div class="metric-row joined">
          ${this._renderMetric('Outlet', this._outletStatus(entity, getEntity(this.hass, this._config?.outlet_entity)))}
          ${this._renderMetric('Today', this._entityMetricValue(energyTodayEntity, entity, ['today_kwh', 'energy_today']))}
          ${this._renderMetric('Month', this._entityMetricValue(energyMonthEntity, entity, ['month_kwh', 'energy_month']))}
          ${energyTotalEntity ? this._renderMetric('Total', this._entityMetricValue(energyTotalEntity, entity, ['total_kwh', 'energy_total'])) : nothing}
        </div>
        <section>
          <h3>Machine Actions</h3>
          <div class="action-pair">
            ${this._renderActionButton('Shutdown', 'mdi:power-off', this._findAction('shutdown'), 'negative')}
            ${this._renderActionButton('Wake PC', 'mdi:power', this._findAction('wake'), 'positive')}
          </div>
        </section>
        <section>
          <h3>Power Controls</h3>
          <div class="action-pair">
            ${this._renderActionButton('Outlet On', 'mdi:power-plug', this._findAction('outlet_on'), 'positive')}
            ${this._renderActionButton('Outlet Off', 'mdi:power-plug-off', this._findAction('outlet_off'), 'negative')}
          </div>
        </section>
        <div class="note">Protected actions require confirmation before they run.</div>
        ${this._renderConfirmationDialog()}
      </div>
    `;
  }

  private _renderSignal(key: PanelKey, label: string, value: string, icon: string, state: SignalState) {
    return html`<button class=${`signal ${state}${this._activePanel === key ? ' selected' : ''}`} type="button" data-panel=${key} aria-label=${`${label}: ${value}`} title=${label} aria-pressed=${this._activePanel === key} @click=${() => (this._activePanel = key)}>
      <ha-icon .icon=${icon}></ha-icon>
      <strong>${value}</strong>
    </button>`;
  }

  private _renderPanel(
    key: PanelKey,
    entity: HassEntity | undefined,
    energyTodayEntity: HassEntity | undefined,
    energyMonthEntity: HassEntity | undefined,
  ) {
    if (key === 'outlet') {
      return html`
        <div class="bubble-panel action-panel" aria-live="polite">
          <div class="bubble-grid">
            ${this._renderActionButton('Outlet On', 'mdi:power-plug', this._findAction('outlet_on'))}
            ${this._renderActionButton('Outlet Off', 'mdi:power-plug-off', this._findAction('outlet_off'))}
          </div>
        </div>
      `;
    }
    if (key === 'pc') {
      return html`
        <div class="bubble-panel action-panel" aria-live="polite">
          <div class="bubble-grid">
            ${this._renderActionButton('Wake PC', 'mdi:power', this._findAction('wake'))}
            ${this._renderActionButton('Shutdown', 'mdi:power-off', this._findAction('shutdown'))}
          </div>
        </div>
      `;
    }
    return html`
      <div class="bubble-panel power-panel" aria-live="polite">
        <div class="bubble-grid power-bubbles">
          ${this._renderPowerMetric('Current', 'mdi:flash', this._powerMetric(entity, getEntity(this.hass, this._config?.power_entity)), this._config?.power_entity)}
          ${this._renderPowerMetric('Today', 'mdi:calendar-today', this._entityMetricValue(energyTodayEntity, entity, ['today_kwh', 'energy_today']), this._config?.energy_today_entity)}
          ${this._renderPowerMetric('Month', 'mdi:calendar-month', this._entityMetricValue(energyMonthEntity, entity, ['month_kwh', 'energy_month']), this._config?.energy_month_entity)}
        </div>
      </div>
    `;
  }

  private _renderMetric(label: string, metric: string | MetricValue, historyEntityId?: string) {
    const normalized = typeof metric === 'string' ? { present: true, value: metric } : metric;
    const showHistory = Boolean(historyEntityId && normalized.present);
    return html`<button class=${`metric${normalized.present ? '' : ' unavailable'}${showHistory ? ' history-metric' : ''}`} type="button" ?disabled=${!showHistory} aria-disabled=${normalized.present ? nothing : 'true'} @click=${() => historyEntityId && normalized.present && this._showMoreInfo(historyEntityId)}><span>${label}</span><strong>${normalized.value}</strong></button>`;
  }

  private _renderPowerMetric(label: string, icon: string, metric: string | MetricValue, historyEntityId?: string) {
    const normalized = typeof metric === 'string' ? { present: true, value: metric } : metric;
    const showHistory = Boolean(historyEntityId && normalized.present);
    return html`
      <button class=${`metric power-metric${normalized.present ? '' : ' unavailable'}${showHistory ? ' history-metric' : ''}`} type="button" ?disabled=${!showHistory} aria-disabled=${normalized.present ? nothing : 'true'} @click=${() => historyEntityId && normalized.present && this._showMoreInfo(historyEntityId)}>
        <ha-icon .icon=${icon}></ha-icon>
        <span>${label}</span>
        <strong>${normalized.value}</strong>
      </button>
    `;
  }

  private _renderConfirmationDialog() {
    const action = this._pendingConfirmation;
    if (!action?.confirmation) {
      return nothing;
    }

    return html`
      <div class="confirm-backdrop" role="presentation">
        <dialog class="confirm-dialog" open aria-modal="true" aria-labelledby="confirm-title">
          <h3 id="confirm-title">Confirm action</h3>
          <p>${action.confirmation}</p>
          <div class="action-pair">
            <button type="button" data-confirm="cancel" @click=${this._cancelConfirmation}>Cancel</button>
            <button type="button" data-confirm="accept" @click=${this._acceptConfirmation}>Confirm</button>
          </div>
        </dialog>
      </div>
    `;
  }

  private _renderActionButton(label: string, icon: string, action: ComputerControlActionConfig | undefined, tone?: ActionTone) {
    return html`
      <button class=${tone ? `action-${tone}` : nothing} type="button" ?disabled=${!this.hass || !action} @click=${() => action && this._handleAction(action)}>
        <ha-icon .icon=${action?.icon ?? icon}></ha-icon>
        <span>${action?.label ?? label}</span>
      </button>
    `;
  }

  private _findAction(key: ComputerControlActionKey): ComputerControlActionConfig | undefined {
    const actions = this._config?.actions ?? [];
    return actions.find((action) => action.key === key) ?? this._findLegacyAction(key, actions);
  }

  private _findLegacyAction(key: ComputerControlActionKey, actions: ComputerControlActionConfig[]): ComputerControlActionConfig | undefined {
    const legacyTerms: Record<ComputerControlActionKey, string[]> = {
      wake: ['wake'],
      shutdown: ['shutdown'],
      outlet_on: ['outlet on', 'on'],
      outlet_off: ['outlet off', 'off'],
    };
    const terms = legacyTerms[key];
    return (
      actions.find((action) => terms.every((term) => action.label.toLowerCase().includes(term))) ??
      actions.find((action) => terms.some((term) => action.label.toLowerCase().includes(term)))
    );
  }

  private _metricValue(entity: HassEntity | undefined, keys: string[], fallback = 'Unavailable'): MetricValue {
    const value = keys.map((key) => entity?.attributes[key]).find((item) => item !== undefined && item !== null && item !== '');
    return value === undefined ? { present: false, value: fallback } : { present: true, value: String(value) };
  }

  private _entityMetricValue(metricEntity: HassEntity | undefined, fallbackEntity: HassEntity | undefined, fallbackKeys: string[], fallback = 'Unavailable'): MetricValue {
    if (metricEntity && metricEntity.state !== 'unavailable' && metricEntity.state !== 'unknown') {
      const unit = metricEntity.attributes.unit_of_measurement;
      return { present: true, value: `${metricEntity.state}${typeof unit === 'string' ? ` ${unit}` : ''}` };
    }

    return this._metricValue(fallbackEntity, fallbackKeys, fallback);
  }

  private _metric(entity: HassEntity | undefined, keys: string[], fallback: string): string {
    return this._metricValue(entity, keys, fallback).value;
  }

  private _outletStatus(entity: HassEntity | undefined, outletEntity: HassEntity | undefined): string {
    return outletEntity?.state ?? this._metric(entity, ['outlet_status', 'outlet', 'power_outlet'], 'Unknown');
  }

  private _powerMetric(entity: HassEntity | undefined, powerEntity: HassEntity | undefined): string {
    const unit = powerEntity?.attributes.unit_of_measurement;
    if (powerEntity && powerEntity.state !== 'unavailable' && powerEntity.state !== 'unknown') {
      return `${powerEntity.state}${typeof unit === 'string' ? ` ${unit}` : ''}`;
    }

    return this._metric(entity, ['power', 'system_draw', 'draw_w'], '— W');
  }


  private _showMoreInfo(entityId: string): void {
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      bubbles: true,
      composed: true,
      detail: { entityId },
    }));
  }

  private _entityOnOffState(entity: HassEntity | undefined): SignalState {
    if (!entity) {
      return 'unknown';
    }

    return entity.state.toLowerCase() === 'on' ? 'on' : 'off';
  }

  private _pcSignalState(status: string): SignalState {
    return status.toLowerCase() === 'online' ? 'on' : 'off';
  }

  private _powerSignalState(powerEntity: HassEntity | undefined): SignalState {
    if (!this._config?.power_entity) {
      return 'unknown';
    }

    if (!powerEntity || powerEntity.state === 'unavailable' || powerEntity.state === 'unknown') {
      return 'stale';
    }

    const lastUpdated = powerEntity.last_updated ? Date.parse(powerEntity.last_updated) : Number.NaN;
    if (!Number.isFinite(lastUpdated)) {
      return 'stale';
    }

    const oneHourMs = 60 * 60 * 1000;
    return Date.now() - lastUpdated <= oneHourMs ? 'on' : 'stale';
  }

  private _thresholds() {
    return {
      idleWatts: this._config?.thresholds?.idleWatts ?? DEFAULT_THRESHOLDS.idleWatts,
      activeWatts: this._config?.thresholds?.activeWatts ?? DEFAULT_THRESHOLDS.activeWatts,
    };
  }

  private _statusLabel(state: ReturnType<typeof deriveComputerState>): string {
    const labels: Record<ReturnType<typeof deriveComputerState>, string> = {
      outlet_off: 'Outlet off',
      online: 'Online',
      offline_standby: 'Offline',
      booting_or_service_unavailable: 'Booting',
      unknown: 'Unknown',
    };
    return labels[state];
  }

  private async _handleAction(action: ComputerControlActionConfig): Promise<void> {
    if (!this.hass) return;
    if (action.confirmation) {
      const confirmAction: ComputerControlConfirmationHandler | undefined = this._config?.confirmAction;
      if (confirmAction) {
        if (!(await confirmAction(action.confirmation, action))) return;
      } else {
        this._pendingConfirmation = action;
        return;
      }
    }

    await this._callActionService(action);
  }

  private async _acceptConfirmation(): Promise<void> {
    const action = this._pendingConfirmation;
    this._pendingConfirmation = undefined;
    if (action) {
      await this._callActionService(action);
    }
  }

  private _cancelConfirmation(): void {
    this._pendingConfirmation = undefined;
  }

  private async _callActionService(action: ComputerControlActionConfig): Promise<void> {
    if (!this.hass) return;
    const serviceData = {
      ...(action.service_data ?? {}),
    };
    await this.hass.callService(action.domain, action.service, serviceData);
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: 'computer-control-card',
  name: 'Computer Control Card',
  description: 'Frontend-only Lovelace card for controlling computers remotely.',
  preview: true,
  documentationURL: 'https://github.com/kevinboone/computer-control-card#readme',
});

declare global {
  interface HTMLElementTagNameMap {
    'computer-control-card': ComputerControlCard;
  }
}
