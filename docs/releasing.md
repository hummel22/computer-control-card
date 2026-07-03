# Releasing

This project uses semantic versioning for published card releases:

- Patch releases (`v0.1.1`) are for bug fixes and documentation-only release clarifications.
- Minor releases (`v0.2.0`) are for backward-compatible card features.
- Major releases (`v1.0.0`) are for breaking configuration or behavior changes.

## Prepare a release

1. Start from a clean working tree on the branch you intend to release from.
2. Bump `package.json` and `package-lock.json` with one of the npm helpers:

   ```sh
   npm run release:patch
   npm run release:minor
   npm run release:major
   ```

   These scripts call `npm version patch`, `npm version minor`, or `npm version major`. The generated git tag must match the package version with a leading `v`, such as `v0.2.0` for package version `0.2.0`.

3. Build and test the release candidate:

   ```sh
   npm ci
   npm run typecheck
   npm test
   npm run build
   ```

4. Confirm the HACS artifact exists at `dist/computer-control-card.js` and is built from the same commit as the version tag.
5. Push the commit and tag:

   ```sh
   git push origin main
   git push origin vX.Y.Z
   ```

## GitHub release workflow

Pushing a `vX.Y.Z` tag runs the release workflow. The workflow verifies that the tag matches `package.json`, installs dependencies with `npm ci`, runs typecheck and unit tests, builds `dist/computer-control-card.js`, and uploads the built card file as a GitHub release asset.

## HACS updates

HACS discovers updates from repository releases and tags. Users receive an update when a new semantic version tag is published and the release includes the matching built `computer-control-card.js` artifact. The distributed filename must continue to match `hacs.json` (`computer-control-card.js`).
