# 🖥️ Computer Control Card

[![hacs][hacs-badge]][hacs-url]
[![release][release-badge]][release-url]
![downloads][downloads-badge]
[![build][build-badge]][build-url]
![license][license-badge]

![Compact design reference showing an ultra-compact Desktop PC control card with outlet, PC status, and system draw panels.](docs/assets/compact-design-reference.png)

## What is Computer Control Card?

Computer Control Card is a frontend-only custom card for [Home Assistant][home-assistant] Dashboard UI.

Computer Control Card's mission is to provide an easy, focused dashboard tile for monitoring a computer and safely running common remote-control actions such as Wake-on-LAN, graceful shutdown, and outlet power control.

### Features

- 🛠 Dashboard UI editor for common options such as name, entities, Wake-on-LAN settings, actions targets, and layout variant.
- 🖥 Computer-first status display with a main summary entity plus optional dedicated online/status, outlet, power, and energy entities.
- ⚡ Energy and draw monitoring for current watts, daily energy, monthly energy, and lifetime energy.
- 📦 Two layouts: a dense `compact` dashboard tile and an `extended` control panel.
- 🚀 Generated actions from simple fields for Wake-on-LAN, shutdown, outlet on, and outlet off.
- 🧩 Custom Home Assistant service actions when your setup needs scripts, buttons, helpers, or integration-specific services.
- 🛡 Confirmation prompts for protected actions such as shutdown and hard outlet power-off.
- 🧪 Standalone Vite demo, mocked Home Assistant object, unit tests, Playwright checks, and screenshot tests without a live Home Assistant instance.
- 🌓 Light and dark theme support through standard Home Assistant card/theme variables.
- 🌐 Frontend-only install: no custom Python integration, backend service, secrets, or real network devices are required for development or testing.

The goal of Computer Control Card is not to replace full remote-desktop, device-management, or deep dashboard customization tools. For highly customized layouts, you can combine this card with other Lovelace cards such as [Button card][button-card] or dashboard frameworks such as [UI Lovelace Minimalist][ui-lovelace-minimalist].

## Installation

### HACS

Computer Control Card is ready to install as a [HACS][hacs] Dashboard/Lovelace custom repository.

Use this link to directly go to the repository in HACS:

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=hummel22&repository=computer-control-card)

_or_

1. Install HACS if you do not have it already.
2. Open HACS in Home Assistant.
3. Open **⋮ > Custom repositories**.
4. Add this repository URL.
5. Select **Dashboard** (or **Lovelace** in older HACS versions) as the category.
6. Search for **Computer Control Card**.
7. Click the download button. ⬇️
8. Refresh your browser or clear the Home Assistant frontend cache after installing or updating.

HACS normally adds the dashboard resource automatically. If it does not, add this resource manually:

```yaml
resources:
  - url: /hacsfiles/computer-control-card/computer-control-card.js
    type: module
```

### Manual

1. Download `computer-control-card.js` from the [latest release][release-url], or build it locally with `npm run build`.
2. Put `computer-control-card.js` into your Home Assistant `config/www` folder.
3. Add a reference to `computer-control-card.js` in Dashboard. There are two ways to do that:
   - **Using UI:** _Settings_ → _Dashboards_ → _More Options icon_ → _Resources_ → _Add Resource_ → Set _Url_ as `/local/computer-control-card.js` → Set _Resource type_ as `JavaScript Module`.
     **Note:** If you do not see the Resources menu, enable _Advanced Mode_ in your _User Profile_.
   - **Using YAML:** Add the following code to the `lovelace` section.
     ```yaml
     resources:
       - url: /local/computer-control-card.js
         type: module
     ```

To build the file locally:

```sh
corepack enable || true
npm ci
npm run build
```

The production file is written to `dist/computer-control-card.js`.

## Usage

Computer Control Card can be configured using the Home Assistant Dashboard UI editor for common options.

1. In Dashboard UI, click the three dots in the top right corner.
2. Click _Edit Dashboard_.
3. Click the plus button to add a new card.
4. Find _Custom: Computer Control Card_ in the card list.
5. Fill in your computer entities and action targets.

### Cards

One card is available:

- 🖥 [Computer Control Card](docs/cards/computer-control-card.md)

### Basic configuration

```yaml
type: custom:computer-control-card
entity: sensor.desktop_pc_status
name: Desktop PC
variant: compact
```

The configured `entity` is used as the main display state and as a source for optional summary attributes.

### Full configuration

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

### Actions

If you do not provide `actions`, the card generates common controls from first-class configuration fields:

- `wol_mac` creates a Wake PC action that calls `wake_on_lan.send_magic_packet`.
- `broadcast_address` is added to the Wake-on-LAN service data when configured.
- `shutdown_entity` creates a protected `button.press` action.
- `outlet_entity` creates protected `switch.turn_on` and `switch.turn_off` actions.
- `outlet_actions.turn_on` and `outlet_actions.turn_off` can override labels, icons, service data, or confirmation messages for the generated outlet actions.

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
```

Supported action keys are `wake`, `shutdown`, `outlet_on`, and `outlet_off`. For services that do not accept `entity_id`, route the operation through a Home Assistant script or button helper and point the action at that helper instead.

### Theme customization

Computer Control Card works without a custom theme and follows the standard Home Assistant card surface, text, divider, icon, and accent variables where possible. If you want more information about themes, check out the official [Home Assistant documentation about themes][home-assistant-theme-docs].

## Development server

### Standalone demo

You can run the standalone Vite demo without a live Home Assistant instance:

```sh
npm run demo
```

Open the local Vite URL and browse to `/demo/`. The demo uses fixtures and a mocked Home Assistant object, so it must not call real Home Assistant services or real network devices.

### Development

Install dependencies and run the development server:

```sh
corepack enable || true
npm ci
npm run dev
```

### Build

You can build the `computer-control-card.js` file in the `dist` folder by running the build command.

```sh
npm run build
```

### Tests and screenshots

Run type checks, unit tests, and end-to-end tests with:

```sh
npm run typecheck
npm test
npm run test:e2e
```

Run standalone demo screenshot tests after UI-facing changes:

```sh
npm run screenshots
```

Screenshot artifacts are written to `artifacts/screenshots/`, and Playwright reports are written to `artifacts/playwright-report/`.

### Releasing

Release instructions live in [docs/releasing.md](docs/releasing.md). This repository is published as a HACS Dashboard/Lovelace plugin, and release assets include `dist/computer-control-card.js`.

## Troubleshooting

### I don't see the latest changes

1. Check that you have the latest Computer Control Card version in HACS or from the [latest release][release-url].
2. Check that Home Assistant is loading the expected dashboard resource path.
3. Open the browser console and verify that `computer-control-card.js` is not blocked or cached from an older version.
4. Clear your cache:
   - Delete or update the dashboard resource if it points to an old file.
   - Reinstall or redownload Computer Control Card.
   - Hard-refresh the Home Assistant frontend.

### My action does not run

1. Verify that the same service call works in Home Assistant Developer Tools.
2. Confirm that your YAML uses the correct `domain`, `service`, and `service_data`.
3. If the target service does not accept `entity_id`, route the operation through a Home Assistant script or button helper.
4. Keep secrets, real device credentials, and private network details out of issues, fixtures, screenshots, and examples.

## Contributing

Contributions are welcome. Please keep changes frontend-only unless the project scope changes, add or update tests for behavior changes, and run the relevant checks before opening a pull request.

For UI-facing changes, run the standalone screenshot tests:

```sh
npm run screenshots
```

If screenshots change intentionally, update the related artifacts or snapshots and mention the intentional visual update in your pull request.

## Credits

Computer Control Card is inspired by Home Assistant Dashboard patterns and the need for a safe, compact control surface for remotely managed computers.

## License

MIT. See the repository license file for details.

<!-- Badges -->

[hacs-url]: https://github.com/hacs/integration
[hacs-badge]: https://img.shields.io/badge/hacs-custom-orange.svg?style=flat-square
[release-badge]: https://img.shields.io/github/v/release/hummel22/computer-control-card?style=flat-square
[downloads-badge]: https://img.shields.io/github/downloads/hummel22/computer-control-card/total?style=flat-square
[build-badge]: https://img.shields.io/github/actions/workflow/status/hummel22/computer-control-card/ci.yml?branch=main&style=flat-square
[build-url]: https://github.com/hummel22/computer-control-card/actions/workflows/ci.yml
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square

<!-- References -->

[home-assistant]: https://www.home-assistant.io/
[home-assistant-theme-docs]: https://www.home-assistant.io/integrations/frontend/#defining-themes
[hacs]: https://hacs.xyz
[button-card]: https://github.com/custom-cards/button-card
[ui-lovelace-minimalist]: https://ui-lovelace-minimalist.github.io/UI/
[release-url]: https://github.com/hummel22/computer-control-card/releases
