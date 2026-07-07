import type { ComputerControlActionConfig, ComputerControlCardConfig } from './types';

const WAKE_CONFIRMATION = 'Wake this computer?';
const SHUTDOWN_CONFIRMATION = 'Shut down this computer?';
const OUTLET_ON_CONFIRMATION = 'Turn on the outlet?';
const OUTLET_OFF_CONFIRMATION = 'Turn off the outlet?';

const withDefaults = (
  defaults: ComputerControlActionConfig,
  override: Partial<ComputerControlActionConfig> | undefined,
): ComputerControlActionConfig => ({
  ...defaults,
  ...override,
  service_data: {
    ...(defaults.service_data ?? {}),
    ...(override?.service_data ?? {}),
  },
});

export const buildDefaultActions = (config: ComputerControlCardConfig): ComputerControlActionConfig[] => {
  const actions: ComputerControlActionConfig[] = [];

  if (config.wol_mac) {
    actions.push({
      key: 'wake',
      label: 'Wake PC',
      icon: 'mdi:power',
      domain: 'wake_on_lan',
      service: 'send_magic_packet',
      service_data: {
        mac: config.wol_mac,
        ...(config.broadcast_address ? { broadcast_address: config.broadcast_address } : {}),
      },
      confirmation: WAKE_CONFIRMATION,
    });
  }

  if (config.shutdown_entity) {
    actions.push({
      key: 'shutdown',
      label: 'Shutdown',
      icon: 'mdi:power-off',
      domain: 'button',
      service: 'press',
      service_data: { entity_id: config.shutdown_entity },
      confirmation: SHUTDOWN_CONFIRMATION,
    });
  }

  if (config.outlet_entity) {
    actions.push(
      withDefaults(
        {
          key: 'outlet_on',
          label: 'Outlet On',
          icon: 'mdi:power-plug',
          domain: 'switch',
          service: 'turn_on',
          service_data: { entity_id: config.outlet_entity },
          confirmation: OUTLET_ON_CONFIRMATION,
        },
        config.outlet_actions?.turn_on,
      ),
      withDefaults(
        {
          key: 'outlet_off',
          label: 'Outlet Off',
          icon: 'mdi:power-plug-off',
          domain: 'switch',
          service: 'turn_off',
          service_data: { entity_id: config.outlet_entity },
          confirmation: OUTLET_OFF_CONFIRMATION,
        },
        config.outlet_actions?.turn_off,
      ),
    );
  }

  return actions;
};
