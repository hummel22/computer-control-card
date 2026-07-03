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

Open or download the PNG files in that directory to inspect the compact card and extended card for every fixture state, plus the named compact popover states. Playwright failure artifacts and traces are written to:

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

The standalone mocked demo harness is the primary development and test path for this repository. A real Home Assistant instance is not required for tests and should not be required by new tests. Use the devcontainer path only as a secondary manual smoke-test option when you specifically need to see the card inside a disposable Home Assistant dashboard.

This repository includes `.devcontainer/devcontainer.json` for that optional workflow. It follows common custom-card development patterns by:

- using a Home Assistant development container image;
- mounting this repository at `/config/www/workspace`, which makes built files available to Home Assistant under `/local/workspace/...`;
- forwarding Home Assistant on port `8123`;
- forwarding the Vite dev server on port `5173`;
- installing Node dependencies with `npm ci` after the container is created.

### Start the optional devcontainer workflow

1. Open the repository in VS Code or another tool that supports Dev Containers.
2. Reopen the repository in the devcontainer. The repository workspace will be mounted at `/config/www/workspace`.
3. Start the Vite development server when you want to load the card source directly:

   ```sh
   npm run dev
   ```

4. Start or open your disposable Home Assistant development instance on the forwarded `8123` port if your devcontainer environment does not start it automatically.

### Register the card as a Lovelace resource

During active development, prefer the Vite-served module so browser refreshes pick up source changes without rebuilding:

```yaml
url: http://localhost:5173/src/computer-control-card.ts
type: module
```

If your browser reaches forwarded ports through a different host name, replace `localhost` with that host name. The URL is loaded by the browser, not by the Home Assistant backend.

For a built-file smoke test, run:

```sh
npm run build
```

Then register the built module from the repository mount exposed through Home Assistant's `/local` path:

```yaml
url: /local/workspace/dist/computer-control-card.js
type: module
```

A sample Lovelace dashboard fragment is available at `docs/dashboard-sample.yaml`. It includes both resource options as comments and a sample `custom:computer-control-card` configuration using demo-style placeholder entities.

Keep this path optional and disposable: do not use secrets, personal production Home Assistant instances, or real network devices for validation. Continue to use `npm run demo`, unit tests, and Playwright tests for normal development coverage.

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
