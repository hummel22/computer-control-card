import type { ComputerControlCardConfig, HassEntity, HomeAssistant } from './types';

export type ComputerDerivedState =
  | 'outlet_off'
  | 'online'
  | 'offline_standby'
  | 'booting_or_service_unavailable'
  | 'unknown';

export interface ComputerStateThresholds {
  idleWatts: number;
  activeWatts: number;
}

export interface DeriveComputerStateInput {
  outletState?: string | null | undefined;
  statusState?: string | null | undefined;
  powerWatts?: number | string | null | undefined;
  thresholds: ComputerStateThresholds;
}

const UNAVAILABLE_STATES = new Set(['unavailable', 'unknown']);

const normalizeState = (state: string | null | undefined): string | undefined => {
  if (typeof state !== 'string') {
    return undefined;
  }

  const normalized = state.trim().toLowerCase();
  return normalized.length > 0 ? normalized : undefined;
};

const isUnavailableState = (state: string | undefined): boolean => !state || UNAVAILABLE_STATES.has(state);

const parsePowerWatts = (powerWatts: number | string | null | undefined): number | undefined => {
  if (typeof powerWatts === 'number') {
    return Number.isFinite(powerWatts) ? powerWatts : undefined;
  }

  if (typeof powerWatts === 'string' && powerWatts.trim().length > 0) {
    const parsed = Number(powerWatts);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

const hasValidThresholds = (thresholds: ComputerStateThresholds): boolean =>
  Number.isFinite(thresholds.idleWatts) && Number.isFinite(thresholds.activeWatts);

export const deriveComputerState = (input: DeriveComputerStateInput): ComputerDerivedState => {
  const outletState = normalizeState(input.outletState);

  if (isUnavailableState(outletState)) {
    return 'unknown';
  }

  if (outletState === 'off') {
    return 'outlet_off';
  }

  if (outletState !== 'on') {
    return 'unknown';
  }

  const statusState = normalizeState(input.statusState);

  if (isUnavailableState(statusState) || !hasValidThresholds(input.thresholds)) {
    return 'unknown';
  }

  if (statusState === 'on') {
    return 'online';
  }

  if (statusState !== 'off') {
    return 'unknown';
  }

  const powerWatts = parsePowerWatts(input.powerWatts);

  if (powerWatts === undefined) {
    return 'unknown';
  }

  if (powerWatts < input.thresholds.idleWatts) {
    return 'offline_standby';
  }

  if (powerWatts > input.thresholds.activeWatts) {
    return 'booting_or_service_unavailable';
  }

  return 'unknown';
};

export const getEntity = (hass: HomeAssistant | undefined, entityId: string | undefined): HassEntity | undefined => {
  if (!hass || !entityId) {
    return undefined;
  }

  return hass.states[entityId];
};

export const getDisplayName = (config: ComputerControlCardConfig, entity: HassEntity | undefined): string => {
  if (config.name) {
    return config.name;
  }

  const friendlyName = entity?.attributes.friendly_name;
  if (typeof friendlyName === 'string' && friendlyName.length > 0) {
    return friendlyName;
  }

  return config.entity ?? 'Computer';
};

export const getStatusLabel = (entity: HassEntity | undefined): string => {
  if (!entity) {
    return 'Not configured';
  }

  return entity.state.replaceAll('_', ' ');
};
