import type { HassEntity } from '../src/types';

export type FixtureKey =
  | 'online'
  | 'outlet_off'
  | 'offline_standby'
  | 'booting_or_service_unavailable'
  | 'status_unavailable'
  | 'power_unavailable'
  | 'missing_optional_entities';

export const PRIMARY_ENTITY = 'sensor.demo_pc_summary';
export const OUTLET_ENTITY = 'switch.demo_pc_outlet';
export const STATUS_ENTITY = 'binary_sensor.demo_pc_status';
export const POWER_ENTITY = 'sensor.demo_pc_power';
export const ENERGY_TODAY_ENTITY = 'sensor.demo_pc_energy_today';
export const ENERGY_MONTH_ENTITY = 'sensor.demo_pc_energy_month';

const now = () => new Date().toISOString();

const entity = (entity_id: string, state: string, attributes: Record<string, unknown>): HassEntity => ({
  entity_id,
  state,
  attributes,
  last_changed: now(),
  last_updated: now(),
});

export const fixtures: Record<FixtureKey, Record<string, HassEntity>> = {
  online: {
    [PRIMARY_ENTITY]: entity(PRIMARY_ENTITY, 'summary', {
      friendly_name: 'Studio Workstation',
      outlet_status: 'on',
      power: '143 W',
      today_kwh: '2.8 kWh',
      month_kwh: '84.6 kWh',
      trend: 'Rendering workload; draw is elevated.',
    }),
    [OUTLET_ENTITY]: entity(OUTLET_ENTITY, 'on', { friendly_name: 'PC Outlet' }),
    [STATUS_ENTITY]: entity(STATUS_ENTITY, 'on', { friendly_name: 'PC Online' }),
    [POWER_ENTITY]: entity(POWER_ENTITY, '143', { friendly_name: 'PC Power', unit_of_measurement: 'W' }),
    [ENERGY_TODAY_ENTITY]: entity(ENERGY_TODAY_ENTITY, '2.8', { friendly_name: 'PC Energy Today', unit_of_measurement: 'kWh' }),
    [ENERGY_MONTH_ENTITY]: entity(ENERGY_MONTH_ENTITY, '84.6', { friendly_name: 'PC Energy Month', unit_of_measurement: 'kWh' }),
  },
  outlet_off: {
    [PRIMARY_ENTITY]: entity(PRIMARY_ENTITY, 'summary', { friendly_name: 'Studio Workstation', outlet_status: 'off', power: '0 W', today_kwh: '0.3 kWh', month_kwh: '41.2 kWh', trend: 'Outlet is switched off.' }),
    [OUTLET_ENTITY]: entity(OUTLET_ENTITY, 'off', { friendly_name: 'PC Outlet' }),
  },
  offline_standby: {
    [PRIMARY_ENTITY]: entity(PRIMARY_ENTITY, 'summary', { friendly_name: 'Studio Workstation', outlet_status: 'on', power: '4 W', today_kwh: '0.7 kWh', month_kwh: '52.5 kWh', trend: 'Wake-on-LAN standby draw detected.' }),
    [OUTLET_ENTITY]: entity(OUTLET_ENTITY, 'on', { friendly_name: 'PC Outlet' }),
    [STATUS_ENTITY]: entity(STATUS_ENTITY, 'off', { friendly_name: 'PC Online' }),
    [POWER_ENTITY]: entity(POWER_ENTITY, '4', { friendly_name: 'PC Power', unit_of_measurement: 'W' }),
    [ENERGY_TODAY_ENTITY]: entity(ENERGY_TODAY_ENTITY, '0.7', { friendly_name: 'PC Energy Today', unit_of_measurement: 'kWh' }),
    [ENERGY_MONTH_ENTITY]: entity(ENERGY_MONTH_ENTITY, '52.5', { friendly_name: 'PC Energy Month', unit_of_measurement: 'kWh' }),
  },
  booting_or_service_unavailable: {
    [PRIMARY_ENTITY]: entity(PRIMARY_ENTITY, 'summary', { friendly_name: 'Studio Workstation', outlet_status: 'on', power: '62 W', today_kwh: '1.1 kWh', month_kwh: '61.8 kWh', trend: 'Power draw suggests booting or an unreachable service.' }),
    [OUTLET_ENTITY]: entity(OUTLET_ENTITY, 'on', { friendly_name: 'PC Outlet' }),
    [STATUS_ENTITY]: entity(STATUS_ENTITY, 'off', { friendly_name: 'PC Online' }),
    [POWER_ENTITY]: entity(POWER_ENTITY, '62', { friendly_name: 'PC Power', unit_of_measurement: 'W' }),
    [ENERGY_TODAY_ENTITY]: entity(ENERGY_TODAY_ENTITY, '1.1', { friendly_name: 'PC Energy Today', unit_of_measurement: 'kWh' }),
    [ENERGY_MONTH_ENTITY]: entity(ENERGY_MONTH_ENTITY, '61.8', { friendly_name: 'PC Energy Month', unit_of_measurement: 'kWh' }),
  },
  status_unavailable: {
    [PRIMARY_ENTITY]: entity(PRIMARY_ENTITY, 'summary', { friendly_name: 'Studio Workstation', outlet_status: 'on', power: '37 W', today_kwh: '1.4 kWh', month_kwh: '63.9 kWh', trend: 'Status sensor is unavailable.' }),
    [OUTLET_ENTITY]: entity(OUTLET_ENTITY, 'on', { friendly_name: 'PC Outlet' }),
    [STATUS_ENTITY]: entity(STATUS_ENTITY, 'unavailable', { friendly_name: 'PC Online' }),
  },
  power_unavailable: {
    [PRIMARY_ENTITY]: entity(PRIMARY_ENTITY, 'summary', { friendly_name: 'Studio Workstation', outlet_status: 'on', power: '— W', today_kwh: '1.6 kWh', month_kwh: '64.1 kWh', trend: 'Power sensor is unavailable.' }),
    [OUTLET_ENTITY]: entity(OUTLET_ENTITY, 'on', { friendly_name: 'PC Outlet' }),
    [STATUS_ENTITY]: entity(STATUS_ENTITY, 'off', { friendly_name: 'PC Online' }),
    [POWER_ENTITY]: entity(POWER_ENTITY, 'unavailable', { friendly_name: 'PC Power' }),
  },
  missing_optional_entities: {
    [PRIMARY_ENTITY]: entity(PRIMARY_ENTITY, 'summary', { friendly_name: 'Minimal PC', outlet_status: 'on', power: '96 W' }),
  },
};
