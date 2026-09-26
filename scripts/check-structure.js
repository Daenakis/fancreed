/**
 * Enforces the component folder structure (run by `yarn lint` and pre-commit).
 *
 * Components — src/ui/components/[Name]/ and src/features/[f]/components/[Name]/:
 *   exactly [Name].tsx + index.ts + types.ts, nothing else, no subfolders.
 *   Sub-components that aren't worth their own folder live inside [Name].tsx.
 * Shared UI components also need a test: __tests__/ui/[Name].test.tsx.
 * Screens — src/features/[f]/screens/[Name]Screen/:
 *   [Name]Screen.tsx + index.ts (+ types.ts when the screen takes props).
 * Storybook files (*.stories.*) are not allowed anywhere in src/.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const errors = [];

const rel = (p) => path.relative(ROOT, p);
const isDir = (p) => fs.existsSync(p) && fs.statSync(p).isDirectory();
const subdirs = (p) =>
  isDir(p)
    ? fs
        .readdirSync(p)
        .map((n) => path.join(p, n))
        .filter(isDir)
    : [];

function checkFolder(dir, { required, optional = [], suffix = '' }) {
  const name = path.basename(dir);

  if (!/^[A-Z][A-Za-z0-9]*$/.test(name) || !name.endsWith(suffix)) {
    errors.push(
      `${rel(dir)}: folder must be PascalCase${suffix ? ` and end with "${suffix}"` : ''}`,
    );
    return;
  }

  const allowed = [...required, ...optional].map((f) =>
    f.replace('[Name]', name),
  );
  const entries = fs.readdirSync(dir).filter((f) => f !== '.DS_Store');

  for (const file of required.map((f) => f.replace('[Name]', name))) {
    if (!entries.includes(file)) errors.push(`${rel(dir)}: missing ${file}`);
  }
  for (const entry of entries) {
    if (!allowed.includes(entry)) {
      errors.push(
        `${rel(dir)}: unexpected "${entry}" — only ${allowed.join(', ')} allowed`,
      );
    }
  }
}

const COMPONENT = { required: ['[Name].tsx', 'index.ts', 'types.ts'] };
const SCREEN = {
  required: ['[Name].tsx', 'index.ts'],
  optional: ['types.ts'],
  suffix: 'Screen',
};

// Shared UI components (+ required test)
for (const dir of subdirs(path.join(SRC, 'ui/components'))) {
  checkFolder(dir, COMPONENT);
  const test = path.join(
    ROOT,
    '__tests__/ui',
    `${path.basename(dir)}.test.tsx`,
  );
  if (!fs.existsSync(test))
    errors.push(`${rel(dir)}: missing test ${rel(test)}`);
}

// Feature components and screens
for (const feature of subdirs(path.join(SRC, 'features'))) {
  for (const dir of subdirs(path.join(feature, 'components'))) {
    checkFolder(dir, COMPONENT);
  }
  for (const dir of subdirs(path.join(feature, 'screens'))) {
    checkFolder(dir, SCREEN);
  }
}

// No Storybook
(function findStories(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (isDir(full)) findStories(full);
    else if (/\.stories\.[jt]sx?$/.test(entry)) {
      errors.push(`${rel(full)}: Storybook files are not used in this project`);
    }
  }
})(SRC);

if (errors.length) {
  console.error('❌ Folder structure check failed:\n');
  errors.forEach((e) => console.error(`  • ${e}`));
  console.error('\nSee CLAUDE.md → "Component = folder".');
  process.exit(1);
}

console.log('✅ Folder structure OK');
