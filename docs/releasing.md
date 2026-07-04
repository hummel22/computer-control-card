# Releasing

This project publishes a frontend-only Home Assistant Lovelace card as a HACS Dashboard/Lovelace plugin.
It is not a Home Assistant Python integration, so it intentionally does not use `custom_components/`, `manifest.json`, or integration brand assets.
It is not a HACS custom template, so it intentionally does not ship a root `.jinja` file.

## Version policy

Every commit that lands on `main` must result in a full GitHub release with its own semantic version tag.
This repository always increments the patch component for those automated releases (`X.Y.Z` -> `X.Y.(Z+1)`).
Minor and major version bumps are intentionally not exposed as npm helper scripts so the release cadence stays consistent with the HACS default-repository expectation that released code is available from GitHub releases.

## Automated release from `main`

The `Version bump and release` workflow runs for pushes to `main` unless the push was made by `github-actions[bot]`.
The workflow:

1. Installs dependencies with `npm ci`.
2. Runs `npm run typecheck` and `npm test`.
3. Builds `dist/computer-control-card.js`.
4. Verifies `hacs.json` points to the built card filename.
5. Runs `npm version patch` to update `package.json` and `package-lock.json`, create a `chore(release): vX.Y.Z` commit, and create the matching `vX.Y.Z` tag.
6. Pushes the version commit and tag.
7. Publishes a full GitHub release for that tag with `dist/computer-control-card.js` attached.

The separate `Release` workflow remains available for manual or externally-created `vX.Y.Z` tags and verifies that the tag matches `package.json` before publishing an artifact.

## Manual patch preparation

For local release preparation, run only the patch helper:

```sh
npm run release:patch
```

This updates `package.json` and `package-lock.json` without creating a local git tag. Commit the updated version files only when you intentionally need to prepare a patch release outside the automated `main` workflow.

Before pushing release-related changes, verify the package locally:

```sh
npm ci
npm run typecheck
npm test
npm run build
```

## HACS plugin requirements

HACS installs this card from the built file named by `hacs.json`:

```json
{
  "filename": "computer-control-card.js"
}
```

Keep the built artifact at `dist/computer-control-card.js`. HACS discovers updates from semantic version tags and GitHub releases, so each published tag must have a corresponding full GitHub release with the built card asset attached.
