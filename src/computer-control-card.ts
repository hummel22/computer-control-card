import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_ACTIONS } from './actions';
import { getDisplayName, getEntity, getStatusLabel } from './state';
import { styles } from './styles';
import type { ComputerControlActionConfig, ComputerControlCardConfig, HomeAssistant, LovelaceCardConfig } from './types';

const CARD_TYPE = 'custom:computer-control-card';

@customElement('computer-control-card')
export class ComputerControlCard extends LitElement {
  static override styles = styles;

  @property({ attribute: false })
  public hass?: HomeAssistant;

  @state()
  private _config?: ComputerControlCardConfig;

  public setConfig(config: LovelaceCardConfig): void {
    if (config.type !== CARD_TYPE) {
      throw new Error(`Expected card type "${CARD_TYPE}".`);
    }

    this._config = {
      ...config,
      actions: (config as ComputerControlCardConfig).actions ?? DEFAULT_ACTIONS,
    } as ComputerControlCardConfig;
  }

  public getCardSize(): number {
    return 3;
  }

  protected override render() {
    if (!this._config) {
      return html`<ha-card><div class="empty">Card is not configured.</div></ha-card>`;
    }

    const entity = getEntity(this.hass, this._config.entity);
    const displayName = getDisplayName(this._config, entity);
    const status = getStatusLabel(entity);
    const actions = this._config.actions ?? [];

    return html`
      <ha-card header=${this._config.title ?? nothing}>
        <div class="header">
          <div>
            <h2>${displayName}</h2>
            <div class="status">${status}</div>
          </div>
        </div>
        ${actions.length > 0
          ? html`<div class="actions">${actions.map((action) => this._renderAction(action))}</div>`
          : html`<div class="empty">No actions configured.</div>`}
      </ha-card>
    `;
  }

  private _renderAction(action: ComputerControlActionConfig) {
    return html`
      <button type="button" ?disabled=${!this.hass} @click=${() => this._handleAction(action)}>
        ${action.icon ? html`<ha-icon .icon=${action.icon}></ha-icon>` : nothing}
        <span>${action.label}</span>
      </button>
    `;
  }

  private async _handleAction(action: ComputerControlActionConfig): Promise<void> {
    if (!this.hass) {
      return;
    }

    if (action.confirmation && !window.confirm(action.confirmation)) {
      return;
    }

    const serviceData = {
      ...(this._config?.entity ? { entity_id: this._config.entity } : {}),
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
