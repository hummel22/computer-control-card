import { expect, test } from '@playwright/test';
import {
  acceptConfirmation,
  actionButton,
  card,
  configureDashboardCard,
  expectNoConsoleErrors,
  expectServiceCall,
  fixtureStates,
  gotoDemo,
  outletEntity,
  selectFixture,
  shutdownEntity,
  signal,
  wakeBroadcastAddress,
  wakeMac,
} from './helpers';

const expectedStatusLabels: Record<(typeof fixtureStates)[number], string> = {
  online: 'Online',
  outlet_off: 'Outlet off',
  offline_standby: 'Offline standby',
  booting_or_service_unavailable: 'Booting or service unavailable',
  status_unavailable: 'Unknown',
  power_unavailable: 'Unknown',
  missing_optional_entities: 'Unknown',
};

const screenshot = async (locator: ReturnType<typeof card>, name: string): Promise<void> => {
  await locator.screenshot({ path: `test-results/${name}.png` });
};

test.describe('Computer Control Card demo', () => {
  test('renders compact variant in every fixture state and captures screenshots', async ({ page }) => {
    const consoleErrors = expectNoConsoleErrors(page);
    await gotoDemo(page);

    for (const fixture of fixtureStates) {
      await selectFixture(page, fixture);
      const compact = card(page, 'compact');
      await expect(compact).toBeVisible();
      await expect(compact.locator('.compact-shell')).toBeVisible();
      await expect(compact.locator('.status-pill')).toHaveText(expectedStatusLabels[fixture]);
      await expect(signal(page, 'pc')).toContainText(expectedStatusLabels[fixture]);
      await screenshot(compact, `compact-${fixture}`);
    }

    expect(consoleErrors).toEqual([]);
  });

  test('renders extended variant in every fixture state and captures screenshots', async ({ page }) => {
    const consoleErrors = expectNoConsoleErrors(page);
    await gotoDemo(page);

    for (const fixture of fixtureStates) {
      await selectFixture(page, fixture);
      const extended = card(page, 'extended');
      await expect(extended).toBeVisible();
      await expect(extended.locator('.extended-shell')).toBeVisible();
      await expect(extended.locator('.extended-header .status')).toHaveText(expectedStatusLabels[fixture]);
      await expect(extended.locator('.status-banner strong')).toHaveText(expectedStatusLabels[fixture]);
      await screenshot(extended, `extended-${fixture}`);
    }

    expect(consoleErrors).toEqual([]);
  });

  test('compact signal clicks open the correct panels', async ({ page }) => {
    const consoleErrors = expectNoConsoleErrors(page);
    await gotoDemo(page);

    await signal(page, 'outlet').click();
    await expect(card(page, 'compact').locator('.popover')).toContainText('Power Outlet');
    await expect(actionButton(card(page, 'compact'), 'Outlet On')).toBeVisible();
    await expect(actionButton(card(page, 'compact'), 'Outlet Off')).toBeVisible();

    await signal(page, 'pc').click();
    await expect(card(page, 'compact').locator('.popover')).toContainText('PC Status');
    await expect(actionButton(card(page, 'compact'), 'Wake PC')).toBeVisible();
    await expect(actionButton(card(page, 'compact'), 'Shutdown')).toBeVisible();

    await signal(page, 'draw').click();
    const drawPanel = card(page, 'compact').locator('.popover');
    await expect(drawPanel).toContainText('System Draw');
    await expect(drawPanel).toContainText(/Now|— W/);
    await expect(drawPanel).toContainText(/Today|— kWh/);
    await expect(drawPanel).toContainText(/Month|— kWh/);

    expect(consoleErrors).toEqual([]);
  });

  test('Wake PC calls wake_on_lan.send_magic_packet with configured MAC and broadcast address', async ({ page }) => {
    const consoleErrors = expectNoConsoleErrors(page);
    await gotoDemo(page);
    await signal(page, 'pc').click();

    await actionButton(card(page, 'compact'), 'Wake PC').click();

    await expectServiceCall(page, 'wake_on_lan.send_magic_packet', {
      mac: wakeMac,
      broadcast_address: wakeBroadcastAddress,
    });
    expect(consoleErrors).toEqual([]);
  });

  test('Shutdown requires confirmation, then calls button.press with shutdown_entity', async ({ page }) => {
    const consoleErrors = expectNoConsoleErrors(page);
    await gotoDemo(page);
    await signal(page, 'pc').click();

    await actionButton(card(page, 'compact'), 'Shutdown').click();
    await expect(card(page, 'compact').locator('.confirm-dialog')).toBeVisible();
    await expect(page.locator('[data-service-call="button.press"]')).toHaveCount(0);
    await acceptConfirmation(card(page, 'compact')).click();

    await expectServiceCall(page, 'button.press', {
      entity_id: shutdownEntity,
    });
    expect(consoleErrors).toEqual([]);
  });

  test('Outlet Off requires confirmation, then calls the configured outlet-off action', async ({ page }) => {
    const consoleErrors = expectNoConsoleErrors(page);
    await gotoDemo(page);
    await signal(page, 'outlet').click();

    await actionButton(card(page, 'compact'), 'Outlet Off').click();
    await expect(card(page, 'compact').locator('.confirm-dialog')).toBeVisible();
    await expect(page.locator('[data-service-call="switch.turn_off"]')).toHaveCount(0);
    await acceptConfirmation(card(page, 'compact')).click();

    await expectServiceCall(page, 'switch.turn_off', {
      entity_id: outletEntity,
    });
    expect(consoleErrors).toEqual([]);
  });

  test('disabled and unavailable states are reflected when optional entities/actions are missing', async ({ page }) => {
    const consoleErrors = expectNoConsoleErrors(page);
    await gotoDemo(page);
    await selectFixture(page, 'missing_optional_entities');
    await signal(page, 'pc').click();

    await configureDashboardCard(page, 'compact', {
      wol_mac: undefined,
      shutdown_entity: undefined,
      outlet_actions: {
        turn_off: { confirmation: 'Turn off the outlet?' },
      },
    });

    await expect(actionButton(card(page, 'compact'), 'Wake PC')).toBeDisabled();
    await expect(actionButton(card(page, 'compact'), 'Shutdown')).toBeDisabled();

    await signal(page, 'draw').click();
    const drawPanel = card(page, 'compact').locator('.popover');
    await expect(drawPanel).toContainText('System Draw');
    await expect(drawPanel).toContainText('— kWh');

    expect(consoleErrors).toEqual([]);
  });

  test('writes requested screenshot artifacts @screenshots', async ({ page }) => {
    await gotoDemo(page);

    await selectFixture(page, 'online');
    await card(page, 'compact').screenshot({ path: 'artifacts/screenshots/compact-online.png' });
    await card(page, 'extended').screenshot({ path: 'artifacts/screenshots/extended-online.png' });

    await signal(page, 'outlet').click();
    await card(page, 'compact').screenshot({ path: 'artifacts/screenshots/compact-popover-outlet.png' });
    await signal(page, 'pc').click();
    await card(page, 'compact').screenshot({ path: 'artifacts/screenshots/compact-popover-pc-status.png' });
    await signal(page, 'draw').click();
    await card(page, 'compact').screenshot({ path: 'artifacts/screenshots/compact-popover-system-draw.png' });

    await selectFixture(page, 'outlet_off');
    await card(page, 'compact').screenshot({ path: 'artifacts/screenshots/compact-outlet-off.png' });
    await card(page, 'extended').screenshot({ path: 'artifacts/screenshots/extended-outlet-off.png' });

    await selectFixture(page, 'booting_or_service_unavailable');
    await card(page, 'extended').screenshot({ path: 'artifacts/screenshots/extended-booting.png' });
  });
});
