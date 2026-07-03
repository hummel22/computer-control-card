# Codex Cloud setup and workflow

This document describes the recommended Codex Cloud setup and the commands expected for validating `computer-control-card` changes.

## Recommended setup script

Run this once when preparing a fresh Codex Cloud workspace:

```sh
corepack enable || true
npm ci
npx playwright install --with-deps chromium
```

## Required commands

Run the checks that match the scope of your change:

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

For any UI-facing change, also run the standalone demo screenshot tests:

```sh
npm run screenshots
```

`npm run screenshots` is equivalent to `npm run test:visual`; both execute Playwright tests tagged with `@screenshots`.

## How to inspect rendered screenshots

Screenshot tests write rendered card images to:

```text
artifacts/screenshots/
```

Open or download the PNG files in that directory to inspect the compact card, extended card, and popover states. Playwright failure artifacts and traces are written to:

```text
test-results/
```

The HTML report is written to:

```text
artifacts/playwright-report/
```

After running Playwright locally, you can inspect the report with:

```sh
npx playwright show-report artifacts/playwright-report
```

If screenshot output changed intentionally, update the visual snapshots or screenshot artifacts as appropriate and mention that intentional update in the final response.

## How to run the standalone demo locally

Install dependencies and Playwright Chromium first:

```sh
corepack enable || true
npm ci
npx playwright install --with-deps chromium
```

Start the demo:

```sh
npm run demo
```

The demo opens `/demo/` through Vite. If the browser does not open automatically, use the URL printed by Vite and navigate to `/demo/`.

For automated Playwright runs, the test configuration starts the same standalone demo automatically on `http://127.0.0.1:4173/demo/`.

## Optional Home Assistant devcontainer path

A real Home Assistant instance is not required for tests and should not be required by new tests. If you want to manually validate the card in a Home Assistant development environment, you may optionally use a Home Assistant devcontainer or local Home Assistant frontend setup and load the built card from `dist/computer-control-card.js` as a custom Lovelace resource.

Guidelines for this optional path:

1. Run `npm run build` in this repository.
2. Copy or serve `dist/computer-control-card.js` where your development Home Assistant instance can load it.
3. Add it as a Lovelace JavaScript module resource in the development instance.
4. Use fake/demo entities or a disposable development setup only.

Do not use secrets, personal production Home Assistant instances, or real network devices for validation.

## Troubleshooting

### `npm ci` fails

- Ensure the workspace includes `package-lock.json`.
- Run `corepack enable || true` before installing dependencies.
- If the dependency cache is stale, remove `node_modules/` and rerun `npm ci`.

### Playwright browser is missing

Install Chromium and its dependencies:

```sh
npx playwright install --with-deps chromium
```

### Port `4173` is already in use

Playwright starts Vite on `127.0.0.1:4173` for e2e tests. Stop the process using that port, or run the demo manually on another Vite port for exploratory testing.

### Screenshots are missing

Run the screenshot command directly:

```sh
npm run screenshots
```

Then inspect:

```text
artifacts/screenshots/
```

### Service-call tests fail

Tests should assert calls made through the mocked `hass.callService` implementation in the standalone demo. Do not point tests at a real Home Assistant server, do not send real service calls, and do not involve real devices.
