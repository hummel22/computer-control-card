import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const fixtureStates = [
  'online',
  'outlet_off',
  'offline_standby',
  'booting_or_service_unavailable',
  'status_unavailable',
  'power_unavailable',
  'missing_optional_entities',
] as const;

export type FixtureState = (typeof fixtureStates)[number];
export type CardVariant = 'compact' | 'extended';
export type PanelKey = 'outlet' | 'pc' | 'draw';

export const demoPath = '/demo/';
export const wakeMac = 'AA:BB:CC:DD:EE:FF';
export const wakeBroadcastAddress = '192.168.1.255';
export const shutdownEntity = 'button.demo_pc_shutdown';
export const outletEntity = 'switch.demo_pc_outlet';
export const statusEntity = 'binary_sensor.demo_pc_status';
export const powerEntity = 'sensor.demo_pc_power';

export const card = (page: Page, variant: CardVariant): Locator =>
  page.locator(`[data-card-host="dashboard-medium"] computer-control-card[data-variant="${variant}"]`);

export const signal = (page: Page, panel: PanelKey): Locator =>
  card(page, 'compact').locator(`button[data-panel="${panel}"]`);

export const actionButton = (root: Locator, label: string): Locator =>
  root.locator('button:not(.signal)').filter({ hasText: label });

export const acceptConfirmation = (root: Locator): Locator =>
  root.locator('button[data-confirm="accept"]');

export const serviceLog = (page: Page, service: string): Locator =>
  page.locator(`[data-service-call="${service}"]`).first();

export const gotoDemo = async (page: Page): Promise<void> => {
  await page.goto(demoPath);
  await expect(card(page, 'compact')).toBeVisible();
  await expect(card(page, 'extended')).toBeVisible();
};

export const selectFixture = async (page: Page, fixture: FixtureState): Promise<void> => {
  await page.locator('select[data-fixture]').selectOption(fixture);
  await expect(page.locator(`body[data-fixture="${fixture}"]`)).toBeAttached();
};

export const expectNoConsoleErrors = (page: Page): string[] => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  return consoleErrors;
};

export const expectServiceCall = async (page: Page, service: string, expectedPayload: Record<string, unknown>): Promise<void> => {
  const row = serviceLog(page, service);
  await expect(row).toBeVisible();
  await expect(row).toContainText(JSON.stringify(expectedPayload));
};

export const configureDashboardCard = async (
  page: Page,
  variant: CardVariant,
  actions: Array<Record<string, unknown>>,
): Promise<void> => {
  await page.locator(`[data-card-host="dashboard-medium"] computer-control-card[data-variant="${variant}"]`).evaluate((element, payload) => {
    const cardElement = element as HTMLElement & {
      setConfig: (config: Record<string, unknown>) => void;
      hass?: unknown;
    };
    cardElement.setConfig({
      type: 'custom:computer-control-card',
      title: `${payload.variant} Computer Control`,
      entity: 'sensor.demo_pc_summary',
      outlet_entity: 'switch.demo_pc_outlet',
      status_entity: 'binary_sensor.demo_pc_status',
      power_entity: 'sensor.demo_pc_power',
      thresholds: { idleWatts: 10, activeWatts: 40 },
      name: 'Studio Workstation',
      variant: payload.variant,
      actions: payload.actions,
    });
    cardElement.hass = cardElement.hass;
  }, { actions, variant });
};
