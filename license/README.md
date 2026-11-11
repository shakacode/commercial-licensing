# The ShakaStack License source

This directory is the single source of ShakaCode's commercial license text for React on
Rails Pro, ShakaPerf, and Inertia Rails SSR Cache.

**Status: version 1.0 was approved by ShakaCode on 2026-11-11 without a counsel review.**

## What is binding

The complete license file delivered with a product release governs that release. This
directory is where those files are written. It never changes a released version, and a
product never needs a network connection to read its terms.

## Layout

| Path | Role |
|---|---|
| `source/common-terms.md` | Part A, the terms every product shares |
| `source/products/<slug>.md` | Part B, the Product Schedule of one product |
| `source/summaries/<slug>.md` | The plain-language summary at the top of a file |
| `source/machine/<slug>.yaml` | The machine-readable block |
| `source/history/<slug>.md` | The version history paragraph |
| `source/license.json` | The license version and its status, `proposed` or `approved` |
| `build.mjs` | Compiles one complete file per product. `--check` fails on drift |
| `releases/<version>/` | The compiled files and `manifest.json` with their SHA-256 |
| `archive/` | Every released text, byte for byte, with an index by package and version |
| `notices/` | Additive notices that grant rights without a new license version |
| `consumers.json`, `check-fleet.mjs` | Which repository files must match a known text |
| `COUNSEL.md` | Open points for counsel |
| `CHANGELOG.md` | What changed against each released license |
| `FAQ.md` | The canonical public FAQ. Product sites copy from it |

## Changing the terms

1. Edit `source/`, never a compiled file.
2. Give a changed text a new version in `source/license.json`. An approved release is
   immutable, and the build refuses to rewrite it.
3. Run `node license/build.mjs`, commit the result, and update `CHANGELOG.md`.
4. Each product adopts the new text in its next new version line by vendoring the compiled
   file and updating its pin. A patch or security release of an existing line never does.

## How drift is caught

- `node license/build.mjs --check` fails when a compiled file or manifest differs from the
  source, when a marker is unfilled, or when an approved text still carries a counsel marker.
- Each product pins the SHA-256 of its license file and fails its own checks on any other
  bytes, in the same place that already guards its license today.
- `node license/check-fleet.mjs` reads the license file on each product's default branch and
  fails on bytes that are neither a release here nor an archived text. It runs on a schedule.
