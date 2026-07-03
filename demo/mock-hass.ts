import type { HassEntity, HomeAssistant } from '../src/types';

export interface ServiceCallLogEntry {
  domain: string;
  service: string;
  serviceData?: Record<string, unknown>;
  timestamp: string;
}

export const serviceCalls: ServiceCallLogEntry[] = [];

export interface DemoHomeAssistant extends HomeAssistant {
  setStates(states: Record<string, HassEntity>): void;
}

export const createMockHass = (states: Record<string, HassEntity>, onServiceCall: (entry: ServiceCallLogEntry) => void): DemoHomeAssistant => ({
  states: { ...states },
  localize: (key: string) => key,
  setStates(nextStates: Record<string, HassEntity>) {
    this.states = { ...nextStates };
  },
  async callService(domain: string, service: string, serviceData?: Record<string, unknown>): Promise<void> {
    const entry = { domain, service, serviceData, timestamp: new Date().toISOString() };
    serviceCalls.push(entry);
    onServiceCall(entry);
  },
});

declare global {
  interface Window {
    computerControlDemoCalls: ServiceCallLogEntry[];
  }
}

window.computerControlDemoCalls = serviceCalls;
