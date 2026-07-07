import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  ha-card {
    display: block;
    overflow: hidden;
    padding: 16px;
  }

  .compact-shell,
  .extended-shell {
    display: grid;
    gap: 16px;
  }

  .compact-header,
  .extended-header,
  .identity,
  .header-trailing,
  .action-pair {
    align-items: center;
    display: flex;
    gap: 12px;
  }

  .compact-header,
  .extended-header {
    justify-content: space-between;
  }

  .avatar {
    align-items: center;
    background: color-mix(in srgb, var(--primary-color) 14%, transparent);
    border-radius: 16px;
    color: var(--primary-color);
    display: inline-flex;
    height: 44px;
    justify-content: center;
    width: 44px;
  }

  h2,
  h3,
  p {
    margin: 0;
  }

  h2 {
    color: var(--primary-text-color);
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
  }

  h3 {
    color: var(--primary-text-color);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .status,
  .subtle,
  .empty,
  .note,
  .trend,
  .warning,
  .metric span {
    color: var(--secondary-text-color);
    font-size: 13px;
  }

  .status {
    text-transform: capitalize;
  }

  .status-pill {
    background: color-mix(in srgb, var(--primary-color) 16%, var(--card-background-color));
    border: 1px solid color-mix(in srgb, var(--primary-color) 24%, var(--divider-color));
    border-radius: 999px;
    color: var(--primary-text-color);
    font-size: 12px;
    padding: 5px 10px;
    text-transform: capitalize;
    white-space: nowrap;
  }

  .signal-row,
  .metric-row {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .signal {
    align-items: flex-start;
    flex-direction: column;
    min-height: 92px;
  }

  .signal ha-icon {
    color: var(--disabled-text-color, #9b9b9b);
  }

  .signal.on ha-icon {
    color: var(--success-color, #43a047);
  }

  .signal.selected {
    background: color-mix(in srgb, var(--primary-color) 18%, var(--secondary-background-color, #f4f4f4));
    border-color: color-mix(in srgb, var(--primary-color) 42%, var(--divider-color));
  }

  .signal.stale ha-icon {
    color: var(--error-color, #db4437);
  }

  .signal strong,
  .metric strong,
  .status-banner strong {
    color: var(--primary-text-color);
    font-size: 16px;
    text-transform: capitalize;
  }

  .icon-button {
    border-radius: 999px;
    min-height: 38px;
    padding: 8px;
    width: 38px;
  }

  .status-banner,
  .metric,
  section,
  .note {
    background: var(--secondary-background-color, #f4f4f4);
    border: 1px solid var(--divider-color, transparent);
    border-radius: 18px;
    padding: 14px;
  }

  .status-banner {
    background: linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 24%, var(--card-background-color)), var(--secondary-background-color, #f4f4f4));
    display: grid;
    gap: 4px;
  }

  .joined {
    gap: 0;
  }

  .joined .metric {
    border-radius: 0;
  }

  .joined .metric:first-child {
    border-bottom-left-radius: 18px;
    border-top-left-radius: 18px;
  }

  .joined .metric:last-child {
    border-bottom-right-radius: 18px;
    border-top-right-radius: 18px;
  }

  .metric {
    align-items: flex-start;
    display: grid;
    gap: 6px;
    justify-content: stretch;
    min-height: 74px;
    text-align: left;
  }

  .metric.history-metric::after {
    color: var(--secondary-text-color);
    content: 'History';
    font-size: 11px;
  }

  .bubble-panel {
    gap: 12px;
    min-height: 150px;
  }

  .bubble-panel-heading {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .bubble-panel-heading span {
    color: var(--secondary-text-color);
    font-size: 13px;
    text-transform: capitalize;
  }

  .bubble-grid {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .power-bubbles {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .metric.unavailable {
    background: color-mix(in srgb, var(--secondary-background-color, #f4f4f4) 82%, var(--disabled-text-color, #9b9b9b));
    opacity: 0.68;
  }

  .metric.unavailable strong {
    color: var(--disabled-text-color, var(--secondary-text-color));
  }

  section {
    display: grid;
    gap: 10px;
  }

  .warning {
    color: var(--warning-color, #b26a00);
  }

  .actions {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
  }

  button {
    align-items: center;
    background: var(--secondary-background-color, #f4f4f4);
    border: 1px solid var(--divider-color, transparent);
    border-radius: 12px;
    color: var(--primary-text-color);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    gap: 8px;
    justify-content: center;
    min-height: 44px;
    padding: 8px 12px;
  }

  button:hover:not(:disabled) {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  button.action-positive:not(:disabled) ha-icon {
    color: var(--success-color, #43a047);
  }

  button.action-negative:not(:disabled) ha-icon {
    color: var(--error-color, #db4437);
  }

  button.action-positive:hover:not(:disabled),
  button.action-negative:hover:not(:disabled) {
    color: var(--text-primary-color, #fff);
  }

  button.action-positive:hover:not(:disabled) ha-icon,
  button.action-negative:hover:not(:disabled) ha-icon {
    color: currentcolor;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  button.metric:disabled {
    cursor: default;
    opacity: 1;
  }

  .confirm-backdrop {
    align-items: center;
    background: rgb(0 0 0 / 28%);
    display: flex;
    inset: 0;
    justify-content: center;
    position: fixed;
    z-index: 10;
  }

  .confirm-dialog {
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color, transparent);
    border-radius: 18px;
    box-shadow: var(--ha-card-box-shadow, 0 12px 32px rgb(0 0 0 / 28%));
    color: var(--primary-text-color);
    display: grid;
    gap: 14px;
    max-width: min(360px, calc(100vw - 32px));
    padding: 18px;
  }

  @media (max-width: 420px) {
    .compact-header,
    .action-pair {
      align-items: stretch;
      flex-direction: column;
    }

    .signal-row,
    .metric-row,
    .bubble-grid,
    .power-bubbles {
      grid-template-columns: 1fr;
    }
  }
`;
