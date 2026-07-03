import type { ComputerControlActionConfig } from './types';

export const DEFAULT_ACTIONS: ComputerControlActionConfig[] = [
  {
    label: 'Wake',
    icon: 'mdi:power',
    domain: 'button',
    service: 'press',
  },
  {
    label: 'Shutdown',
    icon: 'mdi:power-off',
    domain: 'button',
    service: 'press',
    confirmation: 'Shut down this computer?',
  },
  {
    label: 'Restart',
    icon: 'mdi:restart',
    domain: 'button',
    service: 'press',
    confirmation: 'Restart this computer?',
  },
];
