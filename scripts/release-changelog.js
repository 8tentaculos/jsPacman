import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// Cut a new versioned section out of the `## [Unreleased]` block in CHANGELOG.md
// and update the compare links at the bottom. Run by the `version` npm lifecycle
// hook.
//
// Prereleases (e.g. `0.0.15-alpha.0`) are intentionally skipped: the changelog
// keeps tracking work under `[Unreleased]` until a stable release is cut.

const { version } = JSON.parse(
    readFileSync(new URL('../package.json', import.meta.url), 'utf8')
);

if (version.includes('-')) process.exit(0);
if (!existsSync('CHANGELOG.md')) process.exit(0);

let changelog = readFileSync('CHANGELOG.md', 'utf8');

// Nothing to do if there is no `[Unreleased]` section to cut.
if (!/^## \[Unreleased\]\s*$/m.test(changelog)) process.exit(0);

const now = new Date();
const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
].join('-');
const tag = `v${version}`;

// Insert a fresh, empty `[Unreleased]` above the new dated section.
changelog = changelog.replace(
    /^## \[Unreleased\][ \t]*\n+/m,
    `## [Unreleased]\n\n## [${version}] - ${date}\n\n`
);

// Rewrite the compare links: point `[unreleased]` at the new tag and add a link
// for the released version using the previous base.
const links = changelog.match(/^\[unreleased\]:\s*(\S+?)\/compare\/(\S+?)\.\.\.HEAD\s*$/im);
if (links) {
    const [, base, previous] = links;
    const versionLink = previous === 'HEAD'
        ? `${base}/releases/tag/${tag}`
        : `${base}/compare/${previous}...${tag}`;
    changelog = changelog.replace(
        /^\[unreleased\]:.*$/im,
        `[unreleased]: ${base}/compare/${tag}...HEAD\n[${version}]: ${versionLink}`
    );
}

writeFileSync('CHANGELOG.md', changelog);
execSync('git add CHANGELOG.md', { stdio : 'inherit' });
