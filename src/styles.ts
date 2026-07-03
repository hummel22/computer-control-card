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

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  h2 {
    color: var(--primary-text-color);
    font-size: 20px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0;
  }

  .status {
    color: var(--secondary-text-color);
    font-size: 14px;
    text-transform: capitalize;
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

  button:hover {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .empty {
    color: var(--secondary-text-color);
    font-size: 14px;
  }
`;
