import type { ComputerControlCardConfig, HassEntity, HomeAssistant } from './types';

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
