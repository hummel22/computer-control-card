import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { buildDefaultActions } from './actions';
import { deriveComputerState, getDisplayName, getEntity } from './state';
import { styles } from './styles';
import type { ComputerControlActionConfig, ComputerControlCardConfig, ComputerControlConfirmationHandler, HassEntity, HomeAssistant, LovelaceCardConfig } from './types';

const CARD_TYPE = 'custom:computer-control-card';
const DEFAULT_THRESHOLDS = { idleWatts: 10, activeWatts: 40 };
type PanelKey = 'outlet' | 'pc' | 'draw';

@customElement('computer-control-card')
export class ComputerControlCard extends LitElement {
  static override styles = styles;

  @property({ attribute: false })
  public hass?: HomeAssistant;

  @state()
  private _config?: ComputerControlCardConfig;

  @state()
  private _activePanel: PanelKey | undefined;

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
    return this._config?.variant === 'extended' ? 5 : 3;
  }

  protected override render() {
    if (!this._config) {
      return html`<ha-card><div class="empty">Card is not configured.</div></ha-card>`;
    }

    const entity = getEntity(this.hass, this._config.entity);
    const outletEntity = getEntity(this.hass, this._config.outlet_entity);
    const statusEntity = getEntity(this.hass, this._config.status_entity);
    const powerEntity = getEntity(this.hass, this._config.power_entity);
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
          ? this._renderExtended(entity, displayName, status)
          : this._renderCompact(entity, outletEntity, powerEntity, displayName, status)}
      </ha-card>
    `;
  }

  private _renderCompact(entity: HassEntity | undefined, outletEntity: HassEntity | undefined, powerEntity: HassEntity | undefined, displayName: string, status: string) {
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
          ${this._renderSignal('outlet', 'Power Outlet', this._outletStatus(entity, outletEntity), 'mdi:power-plug')}
          ${this._renderSignal('pc', 'PC Status', status, 'mdi:desktop-tower')}
          ${this._renderSignal('draw', 'System Draw', this._powerMetric(entity, powerEntity), 'mdi:flash')}
        </div>
        ${this._activePanel ? this._renderPanel(this._activePanel, entity, status) : nothing}
        ${this._renderConfirmationDialog()}
      </div>
    `;
  }

  private _renderExtended(entity: HassEntity | undefined, displayName: string, status: string) {
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
          ${this._renderMetric('Today', this._metric(entity, ['today_kwh', 'energy_today'], '— kWh'))}
          ${this._renderMetric('Month', this._metric(entity, ['month_kwh', 'energy_month'], '— kWh'))}
        </div>
        <section>
          <h3>Machine Actions</h3>
          <div class="action-pair">
            ${this._renderActionButton('Shutdown', 'mdi:power-off', this._findAction('shutdown'))}
            ${this._renderActionButton('Wake PC', 'mdi:power', this._findAction('wake'))}
          </div>
        </section>
        <section>
          <h3>Power Controls</h3>
          <div class="action-pair">
            ${this._renderActionButton('Outlet On', 'mdi:power-plug', this._findAction('outlet on', 'on'))}
            ${this._renderActionButton('Outlet Off', 'mdi:power-plug-off', this._findAction('outlet off', 'off'))}
          </div>
        </section>
        <div class="note">Protected actions require confirmation before they run.</div>
        ${this._renderConfirmationDialog()}
      </div>
    `;
  }

  private _renderSignal(key: PanelKey, label: string, value: string, icon: string) {
    return html`<button class="signal" type="button" data-panel=${key} @click=${() => (this._activePanel = this._activePanel === key ? undefined : key)}>
      <ha-icon .icon=${icon}></ha-icon>
      <span>${label}</span>
      <strong>${value}</strong>
    </button>`;
  }

  private _renderPanel(key: PanelKey, entity: HassEntity | undefined, status: string) {
    if (key === 'outlet') {
      return html`
        <div class="popover">
          <h3>Power Outlet</h3>
          <p>Current outlet status: <strong>${this._outletStatus(entity, getEntity(this.hass, this._config?.outlet_entity))}</strong></p>
          <div class="action-pair">
            ${this._renderActionButton('Outlet On', 'mdi:power-plug', this._findAction('outlet on', 'on'))}
            ${this._renderActionButton('Outlet Off', 'mdi:power-plug-off', this._findAction('outlet off', 'off'))}
          </div>
          <div class="warning">Hard power cuts can cause data loss. Use only when graceful controls are unavailable.</div>
        </div>
      `;
    }
    if (key === 'pc') {
      return html`
        <div class="popover">
          <h3>PC Status</h3>
          <p>Current PC status: <strong>${status}</strong></p>
          <div class="action-pair">
            ${this._renderActionButton('Wake PC', 'mdi:power', this._findAction('wake'))}
            ${this._renderActionButton('Shutdown', 'mdi:power-off', this._findAction('shutdown'))}
          </div>
          <div class="warning">Shutdown is intended to be graceful and may take time to complete.</div>
        </div>
      `;
    }
    return html`
      <div class="popover">
        <h3>System Draw</h3>
        <div class="metric-row">
          ${this._renderMetric('Now', this._powerMetric(entity, getEntity(this.hass, this._config?.power_entity)))}
          ${this._renderMetric('Today', this._metric(entity, ['today_kwh', 'energy_today'], '— kWh'))}
          ${this._renderMetric('Month', this._metric(entity, ['month_kwh', 'energy_month'], '— kWh'))}
        </div>
        <div class="trend">${this._metric(entity, ['trend', 'power_trend'], status)}</div>
      </div>
    `;
  }

  private _renderMetric(label: string, value: string) {
    return html`<div class="metric"><span>${label}</span><strong>${value}</strong></div>`;
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

  private _renderActionButton(label: string, icon: string, action: ComputerControlActionConfig | undefined) {
    return html`
      <button type="button" ?disabled=${!this.hass || !action} @click=${() => action && this._handleAction(action)}>
        <ha-icon .icon=${action?.icon ?? icon}></ha-icon>
        <span>${action?.label ?? label}</span>
      </button>
    `;
  }

  private _findAction(...terms: string[]): ComputerControlActionConfig | undefined {
    const actions = this._config?.actions ?? [];
    return (
      actions.find((action) => terms.every((term) => action.label.toLowerCase().includes(term))) ??
      actions.find((action) => terms.some((term) => action.label.toLowerCase().includes(term)))
    );
  }

  private _metric(entity: HassEntity | undefined, keys: string[], fallback: string): string {
    const value = keys.map((key) => entity?.attributes[key]).find((item) => item !== undefined && item !== null && item !== '');
    return value === undefined ? fallback : String(value);
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
      offline_standby: 'Offline standby',
      booting_or_service_unavailable: 'Booting or service unavailable',
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
});

declare global {
  interface HTMLElementTagNameMap {
    'computer-control-card': ComputerControlCard;
  }
}
