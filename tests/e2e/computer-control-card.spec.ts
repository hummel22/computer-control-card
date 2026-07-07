import { expect, test } from '@playwright/test';
import {
  acceptConfirmation,
  actionButton,
  card,
  configureDashboardCard,
  expectNoConsoleErrors,
  energyMonthEntity,
  energyTodayEntity,
  expectServiceCall,
  fixtureStates,
  gotoDemo,
  outletEntity,
  powerEntity,
  selectFixture,
  shutdownEntity,
  signal,
  wakeBroadcastAddress,
  wakeMac,
} from './helpers';

const expectedStatusLabels: Record<(typeof fixtureStates)[number], string> = {
  online: 'Online',
  outlet_off: 'Outlet off',
  offline_standby: 'Offline',
  booting_or_service_unavailable: 'Booting',
  status_unavailable: 'Unknown',
  power_unavailable: 'Unknown',
  missing_optional_entities: 'Unknown',
};

const screenshot = async (locator: ReturnType<typeof card>, name: string): Promise<void> => {
  await locator.screenshot({ path: `artifacts/screenshots/${name}.png` });
};

test.describe('Computer Control Card demo', () => {
  test('renders compact variant in every fixture state and captures screenshots @screenshots', async ({ page }) => {
    const consoleErrors = expectNoConsoleErrors(page);
    await gotoDemo(page);

    for (const fixture of fixtureStates) {
      await selectFixture(page, fixture);
      const compact = card(page, 'compact');
      await expect(compact).toBeVisible();
      await expect(compact.locator('.compact-shell')).toBeVisible();
      await expect(compact.locator('.status-pill')).toHaveText(expectedStatusLabels[fixture]);
      await expect(signal(page, 'pc')).toContainText(expectedStatusLabels[fixture]);
      await expect(signal(page, 'outlet').locator('span')).toHaveCount(0);
      await expect(signal(page, 'pc').locator('span')).toHaveCount(0);
      await expect(signal(page, 'draw').locator('span')).toHaveCount(0);
      await screenshot(compact, `compact-${fixture}`);
    }

    expect(consoleErrors).toEqual([]);
  });

  test('renders extended variant in every fixture state and captures screenshots @screenshots', async ({ page }) => {
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

  test('reports grid rows large enough for rendered card content', async ({ page }) => {
    await gotoDemo(page);

    const measurements = await page.locator('[data-card-host="dashboard-medium"] computer-control-card').evaluateAll((elements) => elements.map((element) => {
      const cardElement = element as HTMLElement & {
        getCardSize: () => number;
        getGridOptions: () => { columns: number; rows: number };
      };
      const variant = cardElement.dataset.variant;
      const renderedHeight = cardElement.getBoundingClientRect().height;
      return {
        variant,
        cardSize: cardElement.getCardSize(),
        gridRows: cardElement.getGridOptions().rows,
        renderedHeight,
      };
    }));

    expect(measurements).toEqual(expect.arrayContaining([
      expect.objectContaining({ variant: 'compact', cardSize: 8, gridRows: 8 }),
      expect.objectContaining({ variant: 'extended', cardSize: 11, gridRows: 11 }),
    ]));

    for (const measurement of measurements) {
      expect(measurement.gridRows * 56).toBeGreaterThanOrEqual(measurement.renderedHeight);
    }
  });

  test('compact signal clicks switch the bubble panel', async ({ page }) => {
    const consoleErrors = expectNoConsoleErrors(page);
    await gotoDemo(page);

    await signal(page, 'outlet').click();
    await expect(card(page, 'compact').locator('.bubble-panel')).toContainText('Power Outlet');
    await expect(actionButton(card(page, 'compact'), 'Outlet On')).toBeVisible();
    await expect(actionButton(card(page, 'compact'), 'Outlet Off')).toBeVisible();

    await signal(page, 'pc').click();
    await expect(card(page, 'compact').locator('.bubble-panel')).toContainText('PC Status');
    await expect(actionButton(card(page, 'compact'), 'Wake PC')).toBeVisible();
    await expect(actionButton(card(page, 'compact'), 'Shutdown')).toBeVisible();

    await signal(page, 'draw').click();
    const drawPanel = card(page, 'compact').locator('.bubble-panel');
    await expect(drawPanel).toContainText('Power');
    await expect(drawPanel).toContainText(/Now|— W/);
    await expect(drawPanel).toContainText(/Today|— kWh/);
    await expect(drawPanel).toContainText(/Month|— kWh/);

    expect(consoleErrors).toEqual([]);
  });

  test('compact power bubble items open Home Assistant history more-info', async ({ page }) => {
    const consoleErrors = expectNoConsoleErrors(page);
    await gotoDemo(page);

    await page.evaluate(() => {
      window.addEventListener('hass-more-info', ((event: Event) => {
        const customEvent = event as CustomEvent<{ entityId: string }>;
        document.body.dataset.moreInfoEntity = customEvent.detail.entityId;
      }) as EventListener);
    });

    await expect(signal(page, 'draw')).toHaveAttribute('aria-pressed', 'true');
    await card(page, 'compact').locator('.bubble-panel .metric.history-metric').filter({ hasText: 'Now' }).click();
    await expect(page.locator('body')).toHaveAttribute('data-more-info-entity', powerEntity);

    expect(consoleErrors).toEqual([]);
  });

  test('compact signals and extended actions use state colors', async ({ page }) => {
    await gotoDemo(page);

    await expect(signal(page, 'outlet')).toHaveClass(/on/);
    await expect(signal(page, 'pc')).toHaveClass(/on/);
    await expect(signal(page, 'draw')).toHaveClass(/on/);
    await expect(card(page, 'extended').locator('button.action-positive')).toHaveCount(2);
    await expect(card(page, 'extended').locator('button.action-negative')).toHaveCount(2);

    await selectFixture(page, 'outlet_off');
    await expect(signal(page, 'outlet')).toHaveClass(/off/);
    await expect(signal(page, 'pc')).toHaveClass(/off/);

    await selectFixture(page, 'power_unavailable');
    await expect(signal(page, 'draw')).toHaveClass(/stale/);

    await configureDashboardCard(page, 'compact', { power_entity: undefined });
    await expect(signal(page, 'draw')).toHaveClass(/unknown/);
  });

  test('Wake PC requires confirmation, then calls wake_on_lan.send_magic_packet with configured MAC and broadcast address', async ({ page }) => {
    const consoleErrors = expectNoConsoleErrors(page);
    await gotoDemo(page);
    await signal(page, 'pc').click();

    await actionButton(card(page, 'compact'), 'Wake PC').click();
    await expect(card(page, 'compact').locator('.confirm-dialog')).toBeVisible();
    await expect(card(page, 'compact').locator('.confirm-dialog')).toContainText('Wake this computer?');
    await expect(page.locator('[data-service-call="wake_on_lan.send_magic_packet"]')).toHaveCount(0);
    await acceptConfirmation(card(page, 'compact')).click();

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

  test('Outlet On requires confirmation, then calls the configured outlet-on action', async ({ page }) => {
    const consoleErrors = expectNoConsoleErrors(page);
    await gotoDemo(page);
    await signal(page, 'outlet').click();

    await actionButton(card(page, 'compact'), 'Outlet On').click();
    await expect(card(page, 'compact').locator('.confirm-dialog')).toBeVisible();
    await expect(page.locator('[data-service-call="switch.turn_on"]')).toHaveCount(0);
    await acceptConfirmation(card(page, 'compact')).click();

    await expectServiceCall(page, 'switch.turn_on', {
      entity_id: outletEntity,
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

  test('separate energy entities populate today and month consumption metrics', async ({ page }) => {
    const consoleErrors = expectNoConsoleErrors(page);
    await gotoDemo(page);

    await configureDashboardCard(page, 'extended', {
      energy_today_entity: energyTodayEntity,
      energy_month_entity: energyMonthEntity,
    });

    const metrics = card(page, 'extended').locator('.metric-row.joined');
    await expect(metrics.locator('.metric').filter({ hasText: 'Today' })).toHaveText(/Today\s*2\.8 kWh/);
    await expect(metrics.locator('.metric').filter({ hasText: 'Month' })).toHaveText(/Month\s*84\.6 kWh/);

    await signal(page, 'draw').click();
    const drawPanel = card(page, 'compact').locator('.bubble-panel');
    await expect(drawPanel.locator('.metric').filter({ hasText: 'Today' })).toHaveText(/Today\s*2\.8 kWh/);
    await expect(drawPanel.locator('.metric').filter({ hasText: 'Month' })).toHaveText(/Month\s*84\.6 kWh/);

    expect(consoleErrors).toEqual([]);
  });

  test('custom actions are matched by explicit action keys instead of labels', async ({ page }) => {
    const consoleErrors = expectNoConsoleErrors(page);
    await gotoDemo(page);

    await configureDashboardCard(page, 'compact', {
      actions: [
        {
          key: 'shutdown',
          label: 'Graceful stop',
          icon: 'mdi:power-off',
          domain: 'button',
          service: 'press',
          service_data: { entity_id: shutdownEntity },
        },
        {
          key: 'wake',
          label: 'Boot workstation',
          icon: 'mdi:power',
          domain: 'wake_on_lan',
          service: 'send_magic_packet',
          service_data: { mac: wakeMac, broadcast_address: wakeBroadcastAddress },
        },
      ],
    });

    await signal(page, 'pc').click();
    await expect(actionButton(card(page, 'compact'), 'Boot workstation')).toBeVisible();
    await expect(actionButton(card(page, 'compact'), 'Graceful stop')).toBeVisible();

    await actionButton(card(page, 'compact'), 'Boot workstation').click();
    await expectServiceCall(page, 'wake_on_lan.send_magic_packet', {
      mac: wakeMac,
      broadcast_address: wakeBroadcastAddress,
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
        turn_off: { key: 'outlet_off', confirmation: 'Turn off the outlet?' },
      },
    });

    await expect(actionButton(card(page, 'compact'), 'Wake PC')).toBeDisabled();
    await expect(actionButton(card(page, 'compact'), 'Shutdown')).toBeDisabled();

    await signal(page, 'draw').click();
    const drawPanel = card(page, 'compact').locator('.bubble-panel');
    await expect(drawPanel).toContainText('Power');
    await expect(drawPanel.locator('.metric.unavailable').filter({ hasText: 'Today' })).toHaveText(/Today\s*Unavailable/);
    await expect(drawPanel.locator('.metric.unavailable').filter({ hasText: 'Month' })).toHaveText(/Month\s*Unavailable/);
    await expect(drawPanel).not.toContainText('— kWh');

    const extendedMetrics = card(page, 'extended').locator('.metric-row.joined');
    await expect(extendedMetrics.locator('.metric.unavailable').filter({ hasText: 'Today' })).toHaveText(/Today\s*Unavailable/);
    await expect(extendedMetrics.locator('.metric.unavailable').filter({ hasText: 'Month' })).toHaveText(/Month\s*Unavailable/);
    await expect(extendedMetrics).not.toContainText('— kWh');

    expect(consoleErrors).toEqual([]);
  });

  test('writes requested screenshot artifacts @screenshots', async ({ page }) => {
    await gotoDemo(page);

    await selectFixture(page, 'online');
    await card(page, 'compact').screenshot({ path: 'artifacts/screenshots/compact-online.png' });
    await card(page, 'extended').screenshot({ path: 'artifacts/screenshots/extended-online.png' });

    await signal(page, 'outlet').click();
    await card(page, 'compact').screenshot({ path: 'artifacts/screenshots/compact-bubbles-outlet.png' });
    await signal(page, 'pc').click();
    await card(page, 'compact').screenshot({ path: 'artifacts/screenshots/compact-bubbles-pc-status.png' });
    await signal(page, 'draw').click();
    await card(page, 'compact').screenshot({ path: 'artifacts/screenshots/compact-bubbles-system-draw.png' });

    await selectFixture(page, 'outlet_off');
    await card(page, 'compact').screenshot({ path: 'artifacts/screenshots/compact-outlet-off.png' });
    await card(page, 'extended').screenshot({ path: 'artifacts/screenshots/extended-outlet-off.png' });

    await selectFixture(page, 'booting_or_service_unavailable');
    await card(page, 'extended').screenshot({ path: 'artifacts/screenshots/extended-booting.png' });
  });
});
