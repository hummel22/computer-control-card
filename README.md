# Computer Control Card

A frontend-only Home Assistant Lovelace custom card for monitoring computer status, energy use, Wake-on-LAN, shutdown, and outlet controls from one dashboard tile.

![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)

## Preview

The card ships with compact and extended layouts so you can choose between dense dashboard summaries and a larger control surface.

![Compact design reference showing an ultra-compact Desktop PC control card with outlet, PC status, and system draw panels.](docs/assets/compact-design-reference.png)

![Extended design reference showing a larger Desktop PC control card with status banner, metrics, machine actions, and power controls.](docs/assets/extended-design-reference.png)

> These images are design references for the intended compact and extended experiences. Use the standalone demo and screenshot tests when validating the current implementation.

## Features

- Monitor a computer summary entity, a dedicated online/status entity, outlet state, current power draw, and daily/monthly/total energy sensors.
- Choose a `compact` dashboard card or an `extended` control panel.
- Generate common actions from simple fields for Wake-on-LAN, shutdown, outlet on, and outlet off.
- Override generated actions with custom Home Assistant service calls when your setup needs scripts, buttons, or integration-specific services.
- Require confirmation before protected actions such as shutdown and hard outlet power-off.
- Run and test locally without a live Home Assistant instance by using the standalone Vite demo and mocked `hass.callService`.

## Installation

### HACS installation

This repository is ready to be installed as a HACS Dashboard/Lovelace custom repository. It includes `hacs.json`, renders this README in HACS, and publishes `computer-control-card.js` from the Vite build output.

Until the card is available in the default HACS repository list, add it as a custom repository:

1. In Home Assistant, open **HACS**.
2. Open **⋮ > Custom repositories**.
3. Add this repository URL.
4. Select **Dashboard** (or **Lovelace** in older HACS versions) as the category.
5. Install **Computer Control Card**.
6. Refresh your browser or clear the Home Assistant frontend cache after installing or updating.

HACS normally adds the dashboard resource automatically. If it does not, add the resource shown in [Dashboard resource setup](#dashboard-resource-setup).

### Manual installation

1. Download or build `computer-control-card.js`.
2. Copy it to your Home Assistant `config/www` directory, for example:

   ```text
   config/www/computer-control-card.js
   ```

3. Add `/local/computer-control-card.js` as a JavaScript module resource in Home Assistant.

To build the file locally:

```sh
corepack enable || true
npm ci
npm run build
```

The production file is written to `dist/computer-control-card.js`.

### Dashboard resource setup

For HACS installs, use the HACS-managed resource path if Home Assistant does not add it automatically:

```yaml
resources:
  - url: /hacsfiles/computer-control-card/computer-control-card.js
    type: module
```

For manual installs copied to `config/www`:

```yaml
resources:
  - url: /local/computer-control-card.js
    type: module
```

You can also add the same resource through the Home Assistant UI: **Settings > Dashboards > ⋮ > Resources > Add Resource**. If the Resources menu is hidden, enable Advanced Mode in your Home Assistant user profile.

## Configuration

### Minimal YAML example

```yaml
type: custom:computer-control-card
entity: sensor.desktop_pc_status
name: Desktop PC
variant: compact
```

The configured `entity` is used as the main display state and as a source for optional summary attributes.

### Visual editor support

This card is currently configured with YAML or the manual card editor. A dedicated Lovelace visual editor is not implemented yet; when one is added, this section should be updated with editor-specific instructions.

### Full YAML example

```yaml
type: custom:computer-control-card
title: Desktop Controls
entity: sensor.desktop_pc_summary
status_entity: binary_sensor.desktop_pc_online
power_entity: sensor.desktop_pc_power
energy_today_entity: sensor.desktop_pc_energy_today
energy_month_entity: sensor.desktop_pc_energy_month
energy_total_entity: sensor.desktop_pc_energy_total
name: Desktop Gaming PC
variant: extended
thresholds:
  idleWatts: 10
  activeWatts: 40
wol_mac: AA:BB:CC:DD:EE:FF
broadcast_address: 192.168.1.255
shutdown_entity: button.desktop_pc_shutdown
outlet_entity: switch.desktop_pc_outlet
outlet_actions:
  turn_on:
    icon: mdi:power-plug
    confirmation: Turn on the PC outlet?
  turn_off:
    icon: mdi:power-plug-off
    confirmation: This immediately removes power from the PC tower. Continue?
```

### Configuration options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | string | Required | Must be `custom:computer-control-card`. |
| `title` | string | none | Optional Home Assistant card header. |
| `entity` | string | none | Main summary entity used for display state and fallback metric attributes. |
| `name` | string | Entity friendly name or `Computer` | Display name shown in the card. |
| `variant` | `compact` \| `extended` | `compact` | Layout density. `compact` uses expandable panels; `extended` keeps controls visible. |
| `status_entity` | string | none | Dedicated status/online entity, such as a binary sensor. |
| `power_entity` | string | none | Dedicated current power draw entity, usually watts. |
| `energy_today_entity` | string | none | Dedicated daily energy entity. Preferred over summary attributes. |
| `energy_month_entity` | string | none | Dedicated monthly energy entity. Preferred over summary attributes. |
| `energy_total_entity` | string | none | Dedicated lifetime/total energy entity. |
| `thresholds.idleWatts` | number | `10` | Power draw threshold used when deriving idle state. |
| `thresholds.activeWatts` | number | `40` | Power draw threshold used when deriving active state. |
| `wol_mac` | string | none | MAC address used to generate the Wake PC action. |
| `broadcast_address` | string | none | Optional Wake-on-LAN broadcast address included with the generated Wake PC action. |
| `shutdown_entity` | string | none | Button entity used to generate a protected shutdown action. |
| `outlet_entity` | string | none | Switch entity used to generate outlet on/off actions. |
| `outlet_actions.turn_on` | object | generated defaults | Partial action override for the generated outlet-on action. |
| `outlet_actions.turn_off` | object | generated defaults | Partial action override for the generated outlet-off action. |
| `actions` | array | generated from first-class fields | Fully custom action list. When supplied, it replaces all generated actions. |
| `confirmAction` | function | browser confirmation flow | Programmatic confirmation hook for tests or embedding contexts. Not configurable in dashboard YAML. |

### Entity attributes used by the card

The card reads these optional attributes from the main `entity` when present:

| Attribute | Purpose |
| --- | --- |
| `outlet_status`, `outlet`, `power_outlet` | Fallback outlet state. |
| `power`, `system_draw`, `draw_w` | Fallback current system draw. |
| `today_kwh`, `energy_today` | Fallback daily energy when `energy_today_entity` is not configured. |
| `month_kwh`, `energy_month` | Fallback monthly energy when `energy_month_entity` is not configured. |
| `total_kwh`, `energy_total` | Fallback total energy when `energy_total_entity` is not configured. |
| `trend`, `power_trend` | Compact system-draw detail text. |

## Actions

### Generated actions

If you do not provide `actions`, the card generates common controls from first-class configuration fields:

- `wol_mac` creates a Wake PC action that calls `wake_on_lan.send_magic_packet`.
- `broadcast_address` is added to the Wake-on-LAN service data when configured.
- `shutdown_entity` creates a protected `button.press` action.
- `outlet_entity` creates protected `switch.turn_on` and `switch.turn_off` actions.
- `outlet_actions.turn_on` and `outlet_actions.turn_off` can override labels, icons, service data, or confirmation messages for the generated outlet actions.

Generated first-class actions include only the service data required by that action.

### Custom actions

Use `actions` when you need full control over the Home Assistant service calls. Supplying `actions` replaces all generated actions, so include every button you want to show.

```yaml
actions:
  - key: wake
    label: Wake PC
    icon: mdi:power
    domain: wake_on_lan
    service: send_magic_packet
    service_data:
      mac: AA:BB:CC:DD:EE:FF
      broadcast_address: 192.168.1.255
  - key: shutdown
    label: Shutdown
    icon: mdi:power-off
    domain: button
    service: press
    service_data:
      entity_id: button.desktop_pc_shutdown
    confirmation: Shut down Desktop PC?
  - key: outlet_on
    label: Outlet On
    icon: mdi:power-plug
    domain: switch
    service: turn_on
    service_data:
      entity_id: switch.desktop_pc_outlet
  - key: outlet_off
    label: Outlet Off
    icon: mdi:power-plug-off
    domain: switch
    service: turn_off
    service_data:
      entity_id: switch.desktop_pc_outlet
    confirmation: This immediately removes power from Desktop PC. Continue?
```

Supported action keys are `wake`, `shutdown`, `outlet_on`, and `outlet_off`. For services that do not accept `entity_id`, route the operation through a Home Assistant script or button helper and point the action at that helper instead.

## Development

Install dependencies with the checked-in lockfile:

```sh
corepack enable || true
npm ci
```

Common commands:

```sh
npm run build
npm run typecheck
npm test
npm run screenshots
```

Additional commands:

```sh
npm run demo       # standalone Vite demo at /demo/
npm run dev        # Vite development server
npm run test:e2e   # full Playwright suite
```

The standalone demo uses fixtures and a mocked Home Assistant object. Tests and demos must not call real Home Assistant services or real network devices.

## Releasing / updates

- Build output is `dist/computer-control-card.js`; HACS uses the `filename` value in `hacs.json`.
- Create versioned Git tags/releases for published builds so HACS users can receive update notifications.
- After a HACS update, reload Home Assistant and clear the browser cache if the old frontend bundle is still visible.
- Manual installs should replace the copied `config/www/computer-control-card.js` file with the new build and then refresh the Home Assistant frontend.

## Support

- Open an issue with your card YAML, relevant entity states/attributes, browser console errors, and Home Assistant version.
- Do not include secrets, real device credentials, or private network details in issues, screenshots, fixtures, or examples.
- If an action does not run, verify the same service call works in Home Assistant Developer Tools first.

## Contributing

Contributions are welcome. Please keep changes frontend-only unless the project scope changes, add or update tests for behavior changes, and run the relevant checks before opening a pull request.

For UI-facing changes, run the standalone screenshot tests:

```sh
npm run screenshots
```

If screenshots change intentionally, update the related artifacts or snapshots and mention the intentional visual update in your pull request.

## License

MIT. See the repository license file for details.
