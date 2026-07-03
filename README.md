# Computer Control Card

A frontend-only Home Assistant Lovelace custom card for monitoring and controlling a desktop PC, server, or other computer from your dashboard. The card is designed around quick status visibility, safe power actions, and a compact/extended layout choice for different dashboard densities.

## Project overview

`computer-control-card` provides a `custom:computer-control-card` Lovelace card that can:

- Show a computer name, status, outlet state, and power/energy metrics from a configured Home Assistant entity.
- Render either a compact card for dense dashboards or an extended card for a larger control panel.
- Call Home Assistant services for actions such as Wake-on-LAN, shutdown, restart, and outlet power control.
- Require confirmation before protected actions such as shutdown, restart, or hard power-off.

The card is a Home Assistant frontend resource built with Lit and Vite. It does not create Home Assistant entities by itself; provide the sensors, switches, buttons, scripts, or Wake-on-LAN services that match your setup.

## HACS installation and readiness notes

This repository includes the files HACS expects for a custom Lovelace card:

- `hacs.json` declares the distributed filename as `computer-control-card.js`.
- The package build output is configured for `dist/computer-control-card.js`.
- The README is renderable by HACS.

Until this repository is available as a default HACS repository, add it as a custom repository:

1. In Home Assistant, open **HACS**.
2. Go to **⋮ > Custom repositories**.
3. Add this repository URL.
4. Select **Dashboard** (or **Lovelace** in older HACS versions) as the category.
5. Install **Computer Control Card**.
6. Clear your browser cache or reload Home Assistant after updating the card.

After installation, HACS normally adds the frontend resource automatically. If you install manually, add the built resource yourself:

```yaml
url: /hacsfiles/computer-control-card/computer-control-card.js
type: module
```

For local/manual development builds, run:

```bash
npm install
npm run build
```

Then copy `dist/computer-control-card.js` to the Home Assistant `www` or HACS-managed custom card location you use.

## Lovelace usage

Add the card to a Lovelace dashboard with YAML mode or the manual card editor:

```yaml
type: custom:computer-control-card
entity: sensor.desktop_pc_status
name: Desktop PC
variant: compact
```

The configured `entity` is used for display state and metric attributes. First-class action fields generate the common controls automatically: `wol_mac` and `broadcast_address` create a `wake_on_lan.send_magic_packet` Wake PC action, `shutdown_entity` creates a `button.press` Shutdown action, and `outlet_entity` creates switch-based outlet controls. You can still provide `actions` for fully custom service calls when your setup needs them.

### Entity attributes used by the card

The card reads these optional attributes from the configured entity when present:

- `outlet_status`, `outlet`, or `power_outlet` for outlet state.
- `power`, `system_draw`, or `draw_w` for current system draw.
- `today_kwh` or `energy_today` for daily energy.
- `month_kwh` or `energy_month` for monthly energy.
- `trend` or `power_trend` for compact system-draw detail text.

## Configuration examples

### Compact variant

Use the compact variant when you want a small overview card with expandable controls for outlet, PC status, and system draw.

```yaml
type: custom:computer-control-card
title: Computer
entity: sensor.desktop_pc_status
name: Desktop PC
variant: compact
wol_mac: AA:BB:CC:DD:EE:FF
broadcast_address: 192.168.1.255
shutdown_entity: button.desktop_pc_shutdown
outlet_entity: switch.desktop_pc_outlet
outlet_actions:
  turn_off:
    confirmation: Hard power off Desktop PC?
```

### Extended variant

Use the extended variant for a larger dashboard tile that keeps machine actions and power controls visible without opening compact panels.

```yaml
type: custom:computer-control-card
title: Desktop Controls
entity: sensor.desktop_pc_status
status_entity: binary_sensor.desktop_pc_online
power_entity: sensor.desktop_pc_power
name: Desktop PC
variant: extended
wol_mac: AA:BB:CC:DD:EE:FF
broadcast_address: 192.168.1.255
shutdown_entity: button.desktop_pc_shutdown
outlet_entity: switch.desktop_pc_outlet
outlet_actions:
  turn_on:
    icon: mdi:power-plug
  turn_off:
    icon: mdi:power-plug-off
    confirmation: This immediately removes power from Desktop PC. Continue?
```

For fully custom controls, provide `actions` with explicit Home Assistant `domain`, `service`, and `service_data`. Custom `actions` replace the automatically generated first-class actions.

Generated first-class actions include only the service data required by that action. For custom `actions`, provide any target entity in `service_data.entity_id`. For services that do not accept `entity_id`, route the operation through a Home Assistant script or button helper and point the card action at that entity instead.

## Screenshots and design references

The images below are design references, not exact render output from the current implementation. They document the intended visual direction and interaction model for the compact and extended layouts.

![Compact design reference showing an ultra-compact Desktop PC control card with outlet, PC status, and system draw panels.](docs/assets/compact-design-reference.png)

**Compact mockup:** a dense overview layout with three tappable status zones and contextual popover panels for outlet controls, machine controls, and power draw details.

![Extended design reference showing a larger Desktop PC control card with status banner, metrics, machine actions, and power controls.](docs/assets/extended-design-reference.png)

**Extended mockup:** a full-height control surface with an online status banner, energy metrics, visible shutdown/wake actions, visible outlet controls, and a confirmation reminder.

## Development

```bash
npm install
npm run build
npm run typecheck
npm test
```

For the local demo app:

```bash
npm run demo
```
