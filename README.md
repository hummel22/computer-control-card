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

The configured `entity` is used for display state and metric attributes. First-class action fields generate the common controls automatically: `wol_mac` and `broadcast_address` create a `wake_on_lan.send_magic_packet` Wake PC action, `shutdown_entity` creates a protected `button.press` Shutdown action, and `outlet_entity` creates protected switch-based outlet controls. You can still provide `actions` for fully custom service calls when your setup needs them.

### Entity attributes used by the card

The card reads these optional attributes from the configured entity when present:

- `outlet_status`, `outlet`, or `power_outlet` for outlet state.
- `power`, `system_draw`, or `draw_w` for current system draw.
- `today_kwh` or `energy_today` for daily energy when `energy_today_entity` is not configured.
- `month_kwh` or `energy_month` for monthly energy when `energy_month_entity` is not configured.
- `trend` or `power_trend` for compact system-draw detail text.

You can also select dedicated energy sensor entities with `energy_today_entity`, `energy_month_entity`, and `energy_total_entity`. Dedicated energy entities are preferred over summary attributes when configured.

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
  turn_on:
    confirmation: Turn on Desktop PC outlet?
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
energy_today_entity: sensor.desktop_pc_energy_today
energy_month_entity: sensor.desktop_pc_energy_month
name: Desktop PC
variant: extended
wol_mac: AA:BB:CC:DD:EE:FF
broadcast_address: 192.168.1.255
shutdown_entity: button.desktop_pc_shutdown
outlet_entity: switch.desktop_pc_outlet
outlet_actions:
  turn_on:
    icon: mdi:power-plug
    confirmation: Turn on Desktop PC outlet?
  turn_off:
    icon: mdi:power-plug-off
    confirmation: This immediately removes power from Desktop PC. Continue?
```

### Direct Wake-on-LAN without a Wake switch

If you do not have a Home Assistant Wake-on-LAN switch entity, configure the card with the PC MAC address and the broadcast address for the target network. The generated Wake PC action calls `wake_on_lan.send_magic_packet` directly; no Home Assistant script or helper is required.

```yaml
type: custom:computer-control-card
title: Desktop Gaming PC
entity: sensor.desktop_pc_summary
status_entity: binary_sensor.desktop_status
power_entity: sensor.outlet_kevins_pc_current_consumption
energy_today_entity: sensor.outlet_kevins_pc_today_s_consumption
energy_month_entity: sensor.outlet_kevins_pc_this_month_s_consumption
name: Desktop Gaming PC
variant: extended
wol_mac: 2c:f0:5d:5c:7c:f6
broadcast_address: 10.11.12.255
shutdown_entity: button.desktop_1ler51g_shutdown
outlet_entity: switch.outlet_kevins_pc
outlet_actions:
  turn_on:
    confirmation: Turn on the PC outlet?
  turn_off:
    confirmation: This immediately removes power from the PC tower. Continue?
```

`power_entity` is intended for current consumption in watts, while `energy_today_entity`, `energy_month_entity`, and `energy_total_entity` can point at separate cumulative energy sensors exposed by the outlet integration.

For fully custom controls, provide `actions` with an explicit `key` plus Home Assistant `domain`, `service`, and `service_data`. The built-in controls use `key` to deterministically map configured actions to the Wake PC, Shutdown, Outlet On, and Outlet Off buttons. Custom `actions` replace the automatically generated first-class actions.

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

Generated first-class actions include only the service data required by that action. For custom `actions`, provide any target entity in `service_data.entity_id`. For services that do not accept `entity_id`, route the operation through a Home Assistant script or button helper and point the card action at that entity instead.

## Screenshots and design references

The images below are design references, not exact render output from the current implementation. They document the intended visual direction and interaction model for the compact and extended layouts.

![Compact design reference showing an ultra-compact Desktop PC control card with outlet, PC status, and system draw panels.](docs/assets/compact-design-reference.png)

**Compact mockup:** a dense overview layout with three tappable status zones and contextual popover panels for outlet controls, machine controls, and power draw details.

![Extended design reference showing a larger Desktop PC control card with status banner, metrics, machine actions, and power controls.](docs/assets/extended-design-reference.png)

**Extended mockup:** a full-height control surface with an online status banner, energy metrics, visible shutdown/wake actions, visible outlet controls, and a confirmation reminder.

## Visual editor support

Home Assistant can show this card in the dashboard visual editor. The editor exposes common fields for the card title, display name, primary/status/power/energy entities, Wake-on-LAN settings, shutdown and outlet entities, and the compact or extended variant. The generated stub configuration starts with a compact card named `Computer`; add your own entities and action targets before saving it to a real dashboard.

## Releasing

Release instructions live in [docs/releasing.md](docs/releasing.md). In short, use `npm run release:patch`, `npm run release:minor`, or `npm run release:major` to bump the package version and create a matching `vX.Y.Z` tag, then let the release workflow build and upload `dist/computer-control-card.js` for HACS users.

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
