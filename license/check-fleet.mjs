#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const consumers = JSON.parse(readFileSync(join(here, 'consumers.json'), 'utf8'));
const known = new Set();

for (const version of readdirSync(join(here, 'releases'), { withFileTypes: true })) {
  if (!version.isDirectory()) continue;
  const manifest = JSON.parse(readFileSync(join(here, 'releases', version.name, 'manifest.json'), 'utf8'));
  for (const product of Object.values(manifest.products)) known.add(product.sha256);
}
for (const file of readdirSync(join(here, 'archive', 'sha256'))) {
  if (!/^[a-f0-9]{64}\.txt$/.test(file)) throw new Error(`invalid archive file ${file}`);
  const expected = file.slice(0, 64);
  if (digest(readFileSync(join(here, 'archive', 'sha256', file))) !== expected) {
    throw new Error(`archive digest mismatch for ${file}`);
  }
  known.add(expected);
}

function canonicalBytes(bytes, bounds) {
  if (!bounds) return bytes;
  const heading = Buffer.from(bounds.after);
  const headingAt = bytes.indexOf(heading);
  if (headingAt < 0) throw new Error('canonical heading missing');
  const startMarker = Buffer.from(`\n${bounds.starts_with}`);
  const startAt = bytes.indexOf(startMarker, headingAt + heading.length);
  if (startAt < 0) throw new Error('canonical start missing');
  const start = startAt + 1;
  const end = bytes.indexOf(Buffer.from(bounds.ends_before), start);
  if (end < 0) throw new Error('canonical end missing');
  return bytes.subarray(start, end);
}

async function check(consumer, bytes) {
  const actual = digest(canonicalBytes(bytes, consumer.canonical_block));
  if (!known.has(actual)) throw new Error(`${consumer.repository} ${consumer.path}: unknown digest ${actual}`);
  console.log(`${consumer.repository} ${consumer.path}: ${actual}`);
}

const fixture = process.argv[2] === '--file' && process.argv.length === 4 ? process.argv[3] : null;
if (process.argv.length > 2 && !fixture) {
  throw new Error('usage: node license/check-fleet.mjs [--file path]');
}
if (fixture) {
  await check({ repository: 'fixture', path: fixture }, readFileSync(fixture));
} else {
  for (const consumer of consumers) {
    const url = `https://raw.githubusercontent.com/${consumer.repository}/${consumer.branch}/${consumer.path}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await check(consumer, Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      console.error(`${consumer.repository} ${consumer.path}: ${error.message}`);
      process.exitCode = 1;
    }
  }
}
