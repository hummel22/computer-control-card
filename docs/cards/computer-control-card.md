# 🖥 Computer Control Card

Computer Control Card is a Home Assistant Lovelace custom card for monitoring a computer and safely running remote-control actions from one dashboard tile.

## Features

- Compact and extended card variants.
- Main summary, status, outlet, power, and energy entities.
- Wake-on-LAN, shutdown, outlet-on, and outlet-off generated actions.
- Fully custom Home Assistant service actions.
- Confirmation prompts for protected actions.
- Visual editor support for common configuration fields.

## Minimal example

```yaml
type: custom:computer-control-card
entity: sensor.desktop_pc_status
name: Desktop PC
variant: compact
```

## Extended example

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
wol_mac: AA:BB:CC:DD:EE:FF
broadcast_address: 192.168.1.255
shutdown_entity: button.desktop_pc_shutdown
outlet_entity: switch.desktop_pc_outlet
```

See the main [README](../../README.md) for the full option table, action reference, installation instructions, and development workflow.
