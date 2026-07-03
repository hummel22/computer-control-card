export interface HomeAssistant {
  callService(domain: string, service: string, serviceData?: Record<string, unknown>): Promise<void>;
  states: Record<string, HassEntity>;
  localize?: (key: string, ...args: unknown[]) => string;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed?: string;
  last_updated?: string;
}

export interface LovelaceCardConfig {
  type: string;
  title?: string;
}

export type HomeAssistantSelector =
  | { entity: Record<string, never> }
  | { text: Record<string, never> }
  | { select: { options: Array<{ label: string; value: string }> } };

export interface HomeAssistantFormSchema {
  name: string;
  label?: string;
  required?: boolean;
  selector: HomeAssistantSelector;
}

export interface LovelaceGridOptions {
  columns: number;
  rows: number;
}

export type ComputerControlActionKey = 'wake' | 'shutdown' | 'outlet_on' | 'outlet_off';

export interface ComputerControlActionConfig {
  key: ComputerControlActionKey;
  label: string;
  icon?: string;
  domain: string;
  service: string;
  service_data?: Record<string, unknown>;
  confirmation?: string;
}

export type ComputerControlConfirmationHandler = (message: string, action: ComputerControlActionConfig) => boolean | Promise<boolean>;

export interface ComputerControlStateThresholds {
  idleWatts?: number;
  activeWatts?: number;
}

export interface ComputerControlOutletActionsConfig {
  turn_on?: Partial<ComputerControlActionConfig>;
  turn_off?: Partial<ComputerControlActionConfig>;
}

export interface ComputerControlCardConfig extends LovelaceCardConfig {
  type: 'custom:computer-control-card';
  title?: string;
  entity?: string;
  wol_mac?: string;
  broadcast_address?: string;
  shutdown_entity?: string;
  outlet_entity?: string;
  outlet_actions?: ComputerControlOutletActionsConfig;
  status_entity?: string;
  power_entity?: string;
  energy_today_entity?: string;
  energy_month_entity?: string;
  energy_total_entity?: string;
  thresholds?: ComputerControlStateThresholds;
  name?: string;
  variant?: 'compact' | 'extended';
  actions?: ComputerControlActionConfig[];
  confirmAction?: ComputerControlConfirmationHandler;
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
  getCardSize?(): number;
  getGridOptions?(): LovelaceGridOptions;
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}
