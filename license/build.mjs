#!/usr/bin/env node
// Compiles the ShakaStack License source into one complete license file per
// product and writes manifest.json with the SHA-256 of each compiled file.
// No dependencies. Usage: node build.mjs [--check]
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'source');
const check = process.argv.includes('--check');

const common = readFileSync(join(src, 'common-terms.md'), 'utf8');
const { license: LICENSE_NAME, version: LICENSE_VERSION, status: STATUS } = JSON.parse(
  readFileSync(join(src, 'license.json'), 'utf8'),
);
if (!['proposed', 'approved'].includes(STATUS)) throw new Error(`unknown status ${STATUS}`);
const out = join(here, 'releases', LICENSE_VERSION);
const manifestPath = join(out, 'manifest.json');

function gitOutput(args) {
  try {
    return execFileSync('git', args, {
      cwd: dirname(here),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return null;
  }
}

if (gitOutput(['rev-parse', '--is-shallow-repository'])?.trim() === 'true') {
  throw new Error('complete Git history required for license build');
}
const releaseHistory = gitOutput(['log', '--format=', '--name-only', 'HEAD', '--', 'license/releases']);
const historicalVersions = (releaseHistory || '').split('\n').flatMap((path) => {
  const match = path.match(/^license\/releases\/([^/]+)\/manifest\.json$/);
  return match ? [match[1]] : [];
});
for (const version of new Set([...readdirSync(join(here, 'releases')), ...historicalVersions])) {
  if (!version) continue;
  const relative = `${version}/manifest.json`;
  const currentPath = join(here, 'releases', relative);
  const current = existsSync(currentPath) ? readFileSync(currentPath, 'utf8') : null;
  const commits = (gitOutput(['log', '--reverse', '--format=%H', 'HEAD', '--',
    `license/releases/${relative}`]) || '').trim().split('\n');
  let approvedCommit = null;
  let baseline = current;
  for (const commit of commits) {
    const candidate = gitOutput(['show', `${commit}:license/releases/${relative}`]);
    if (candidate && JSON.parse(candidate).status === 'approved') {
      approvedCommit = commit;
      baseline = candidate;
      break;
    }
  }
  if (!baseline || JSON.parse(baseline).status !== 'approved') continue;
  if (approvedCommit && current !== baseline) {
    throw new Error(`approved release ${version} changed; bump the version in source/license.json`);
  }
  for (const product of Object.values(JSON.parse(baseline).products)) {
    const filePath = join(here, 'releases', version, product.file);
    const bytes = existsSync(filePath) ? readFileSync(filePath) : null;
    const expected = approvedCommit ? gitOutput(['show',
      `${approvedCommit}:license/releases/${version}/${product.file}`]) : null;
    if (!bytes || createHash('sha256').update(bytes).digest('hex') !== product.sha256 ||
        (approvedCommit && (expected === null || !bytes.equals(Buffer.from(expected))))) {
      throw new Error(`approved release ${version} changed; bump the version in source/license.json`);
    }
  }
}
const STATUS_NOTICE =
  STATUS === 'proposed'
    ? '**Status: proposed text, pending counsel review. Not in force.** The\n`[COUNSEL-n]` markers are open points listed in `license/COUNSEL.md` at\nhttps://github.com/shakacode/commercial-licensing. This notice and the\nmarkers are removed before this text ships in any release.\n\n'
    : '';

function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('product file needs YAML front matter');
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^"|"$/g, '');
  }
  return { meta, body: m[2].trimEnd() };
}

const manifest = { license: LICENSE_NAME, version: LICENSE_VERSION, status: STATUS, products: {} };
let drift = false;
const outputs = [];
for (const file of readdirSync(join(src, 'products')).filter((f) => f.endsWith('.md')).sort()) {
  const { meta, body } = frontMatter(readFileSync(join(src, 'products', file), 'utf8'));
  const slug = meta.slug;
  const summary = readFileSync(join(src, 'summaries', `${slug}.md`), 'utf8').trimEnd();
  const machine = readFileSync(join(src, 'machine', `${slug}.yaml`), 'utf8').trimEnd();
  const history = readFileSync(join(src, 'history', `${slug}.md`), 'utf8').trimEnd();
  if (!common.includes(`${LICENSE_NAME}, version ${LICENSE_VERSION}, applied to {{PRODUCT_NAME}}`) ||
      !meta.spdx.startsWith(`LicenseRef-ShakaStack-${LICENSE_VERSION}-`) ||
      !machine.includes(`license_name: ${LICENSE_NAME} ${LICENSE_VERSION}`) ||
      !machine.includes(`spdx_identifier: ${meta.spdx}`) ||
      !history.startsWith(`${LICENSE_NAME} ${LICENSE_VERSION} `)) {
    throw new Error(`source version mismatch for ${slug}; update source text for ${LICENSE_VERSION}`);
  }
  const compiled = common
    .replace('{{STATUS_NOTICE}}', STATUS_NOTICE)
    .replace('{{SPDX_ID}}', meta.spdx)
    .replaceAll('{{PRODUCT_NAME}}', meta.name)
    .replaceAll('{{COPYRIGHT_YEARS}}', meta.copyright_years)
    .replace('{{PLAIN_SUMMARY}}', summary)
    .replace('{{PRODUCT_SCHEDULE}}', body)
    .replace('{{MACHINE_READABLE}}', machine)
    .replace('{{VERSION_HISTORY}}', history);
  if (/\{\{[A-Z_]+\}\}/.test(compiled)) throw new Error(`unfilled placeholder in ${slug}`);
  if (/[\u2013\u2014]/.test(compiled)) throw new Error(`long dash in ${slug}`);
  if (STATUS === 'approved' && /\[COUNSEL-\d+\]/.test(compiled)) {
    throw new Error(`approved text still carries a counsel marker in ${slug}`);
  }
  const target = join(out, `LICENSE-${slug}.md`);
  const sha256 = createHash('sha256').update(compiled).digest('hex');
  outputs.push([target, compiled]);
  manifest.products[slug] = {
    name: meta.name,
    file: `LICENSE-${slug}.md`,
    sha256,
    spdx: meta.spdx,
    version_marker: `The ShakaStack License, version ${LICENSE_VERSION}, applied to ${meta.name}`,
    packages: meta.packages,
    previous_license: meta.previous_license,
  };
}
outputs.push([manifestPath, JSON.stringify(manifest, null, 2) + '\n']);
if (existsSync(manifestPath)) {
  const previous = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (previous.status === 'approved' && outputs.some(([path, content]) =>
    !existsSync(path) || readFileSync(path, 'utf8') !== content)) {
    throw new Error(`approved release ${LICENSE_VERSION} would change; bump the version in source/license.json`);
  }
}
if (check) {
  for (const [path, content] of outputs) {
    if (!existsSync(path) || readFileSync(path, 'utf8') !== content) {
      drift = true;
      console.error(`DRIFT: ${path}`);
    }
  }
  process.exit(drift ? 1 : 0);
}
mkdirSync(out, { recursive: true });
for (const [path, content] of outputs) {
  writeFileSync(path, content);
  console.log(`wrote ${path}`);
}
