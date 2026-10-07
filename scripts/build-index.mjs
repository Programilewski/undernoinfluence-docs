#!/usr/bin/env node
// Rebuilds the generated part of README.md: every document in the workspace except the
// decision records and journals (which keep their own indexes), with what it is for and
// when it last changed.
//
//   node scripts/build-index.mjs           rewrite README.md
//   node scripts/build-index.mjs --check   exit 1 if README.md is stale or a file has no description
//
// "What it is for" is the `description:` line in a Markdown file's frontmatter, or the
// entry in scripts/non-markdown.json for anything else. "Updated" is the date of the last
// commit that changed the file, following renames, and ignoring commits whose message
// carries the trailer `Index-Date: skip` (moves and path-only rewrites). A file whose last
// change is the initial import of 22.09.2026 has no real date in git; its frontmatter
// `updated:` is used instead, or "≤ 2026-09-22".

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const START = '<!-- index:start -->';
const END = '<!-- index:end -->';

/** Top-level folders in reading order, each with the question it answers. */
const FOLDERS = [
    ['roadmap', 'What is next, and what is not done'],
    ['product', 'What the product is'],
    ['tech', 'How it is built'],
    ['ops', 'What you run to build, deploy and move it'],
    ['business', 'How it makes money'],
    ['brand', 'How it speaks and looks'],
    ['compliance', 'What UNI is legally on the hook for'],
    ['learning', 'How the code works, explained'],
    ['research', 'Questions sent to research models, and their answers'],
    ['briefings', 'Dated documents written for you to read and answer'],
    ['inbox', 'Raw capture, not yet sorted'],
    ['archive', 'Superseded, kept for history'],
];

const EXCLUDED = /^(decisions|journals|scripts)\/|^\.|^README\.md$|^CLAUDE\.md$/;

const files = git('ls-files', '--cached', '--others', '--exclude-standard').split('\n').filter((f) => f && !EXCLUDED.test(f));
const nonMarkdown = JSON.parse(readFileSync(join(root, 'scripts/non-markdown.json'), 'utf8'));

function frontmatter(file) {
    const text = readFileSync(join(root, file), 'utf8');
    if (!text.startsWith('---\n')) {
        return {};
    }
    const block = text.slice(4, text.indexOf('\n---', 4));
    const field = (name) => {
        const match = block.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'));
        if (!match) {
            return null;
        }
        const value = match[1].trim();
        return value.startsWith('"') ? JSON.parse(value) : value;
    };
    return { description: field('description'), updated: field('updated') };
}

/** Last meaningful change per current path, walking history newest first and following renames. */
function lastChanged() {
    const rootCommit = git('rev-list', '--max-parents=0', 'HEAD').trim().split('\n');
    const log = git('log', '-M', '--name-status', '--format=@@%H %cs %(trailers:key=Index-Date,valueonly,separator=%x2C)');
    const pending = new Map(files.map((f) => [f, f])); // path as of the commit being read → current path
    const result = new Map();
    let hash = null;
    let date = null;
    let skip = false;
    for (const line of log.split('\n')) {
        if (line.startsWith('@@')) {
            [hash, date] = line.slice(2).split(' ');
            skip = /skip/.test(line.slice(2 + 41 + 11));
            continue;
        }
        if (!line.trim()) {
            continue;
        }
        const [status, ...paths] = line.split('\t');
        const target = paths.at(-1);
        if (!pending.has(target)) {
            continue;
        }
        const current = pending.get(target);
        const isPureRename = status === 'R100';
        if (!skip && !isPureRename) {
            result.set(current, { date, initial: rootCommit.includes(hash) });
            pending.delete(target);
            continue;
        }
        if (status.startsWith('R')) {
            pending.delete(target);
            pending.set(paths[0], current);
        }
    }
    return result;
}

const changes = lastChanged();
const missing = [];

function row(file, base) {
    const meta = file.endsWith('.md') ? frontmatter(file) : { description: nonMarkdown[file] ?? null };
    if (!meta.description) {
        missing.push(file);
    }
    const change = changes.get(file);
    let updated = change?.date ?? '—';
    if (change?.initial) {
        updated = meta.updated && /^\d{4}-\d{2}-\d{2}$/.test(meta.updated) ? meta.updated : '≤ 2026-09-22';
    }
    const name = file.slice(base.length + 1);
    const link = `[${name.replace(/\|/g, '\\|')}](${encodeURI(file)})`;
    return `| ${link}${newest.has(file) ? ' ★' : ''} | ${meta.description ?? '**no description**'} | ${updated} |`;
}

/** The newest file of each dated series in briefings/, marked ★. */
const newest = new Set();
{
    const series = new Map();
    for (const file of files.filter((f) => f.startsWith('briefings/'))) {
        const name = file.slice('briefings/'.length);
        let key = null;
        let rank = null;
        let match;
        if ((match = name.match(/^(commute|audit)-(\d{4}-\d{2}-\d{2})(?:_(\d+))?\.md$/))) {
            key = match[1];
            rank = `${match[2]}_${(match[3] ?? '1').padStart(2, '0')}`;
        } else if ((match = name.match(/^decisions-waiting-on-you(?:-v(\d+))?(-answered)?\.md$/))) {
            key = 'decisions';
            rank = String(match[1] ? Number(match[1]) : 4).padStart(3, '0') + (match[2] ? 'a' : 'b');
        }
        if (key && (!series.has(key) || series.get(key).rank < rank)) {
            series.set(key, { file, rank });
        }
    }
    for (const { file } of series.values()) {
        newest.add(file);
    }
}

const sections = [];
for (const [folder, question] of FOLDERS) {
    const inFolder = files.filter((f) => f.startsWith(`${folder}/`)).sort((a, b) => {
        const readme = (f) => (f.endsWith('/README.md') ? 0 : 1);
        return readme(a) - readme(b) || a.localeCompare(b);
    });
    if (inFolder.length === 0) {
        continue;
    }
    sections.push(
        `### \`${folder}/\` — ${question}\n\n| Document | What it is for | Updated |\n|---|---|---|\n` +
            inFolder.map((f) => row(f, folder)).join('\n'),
    );
}

const unplaced = files.filter((f) => !FOLDERS.some(([folder]) => f.startsWith(`${folder}/`)));
if (unplaced.length > 0) {
    sections.push(
        '### Not in any folder\n\n| Document | What it is for | Updated |\n|---|---|---|\n' +
            unplaced.map((f) => row(f, '')).join('\n'),
    );
}

const count = (folder) => git('ls-files', folder).split('\n').filter((f) => f.endsWith('.md') && !f.endsWith('README.md')).length;
sections.unshift(
    '### Indexed elsewhere\n\n| Folder | What it holds | Index |\n|---|---|---|\n' +
        `| \`decisions/\` | ${count('decisions')} decision records: why something is the way it is | [decisions/README.md](decisions/README.md) |\n` +
        `| \`journals/\` | ${count('journals')} session journals, one per working day, and the Canary Register | [journals/README.md](journals/README.md) |`,
);

const generated = `${START}\n<!-- Generated by scripts/build-index.mjs. Edit descriptions in each file's frontmatter, not here. -->\n\n${sections.join('\n\n')}\n${END}`;

const readmePath = join(root, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
const startAt = readme.indexOf(START);
const endAt = readme.indexOf(END);
if (startAt === -1 || endAt === -1) {
    console.error(`README.md has no ${START} … ${END} block.`);
    process.exit(1);
}
const next = readme.slice(0, startAt) + generated + readme.slice(endAt + END.length);

if (missing.length > 0) {
    console.error(`No description for:\n  ${missing.join('\n  ')}`);
}

if (process.argv.includes('--check')) {
    const stale = next !== readme;
    if (stale) {
        console.error('README.md index is out of date: run node scripts/build-index.mjs');
    }
    process.exit(stale || missing.length > 0 ? 1 : 0);
}

writeFileSync(readmePath, next);
console.log(`Index rebuilt: ${files.length} documents${missing.length ? `, ${missing.length} without a description` : ''}.`);
