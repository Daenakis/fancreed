/**
 * Converts SVG files exported from Figma into react-native-svg components.
 *
 * Usage:
 *   1. Drop .svg files into assets/icons/ (e.g. arrow_down.svg)
 *   2. yarn icons            → generates only icons that don't exist yet
 *      yarn icons --force    → regenerates and overwrites existing icons
 *
 * Output: src/ui/assets/icons/[Name].tsx + a regenerated index.ts registry.
 * The dark brand colours (#101010, #0B0B0C) are replaced with `currentColor`,
 * so <Icon color="..."> tints the icon. Other colours (brand logos) are kept.
 *
 * Existing icons are skipped by default because some were edited by hand
 * after generation (e.g. Lion.tsx) — use --force only when you mean it.
 */
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { transform } = require('@svgr/core');

const ROOT = path.resolve(__dirname, '..');
const INPUT_DIR = path.join(ROOT, 'assets/icons');
const OUTPUT_DIR = path.join(ROOT, 'src/ui/assets/icons');
const INDEX_FILE = path.join(OUTPUT_DIR, 'index.ts');

const force = process.argv.includes('--force');

const svgrConfig = {
  plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
  native: true,
  typescript: true,
  replaceAttrValues: {
    '#101010': 'currentColor',
    '#0B0B0C': 'currentColor',
  },
  svgoConfig: {
    plugins: [
      // Keep viewBox so the `size` prop scales the icon.
      {
        name: 'preset-default',
        params: { overrides: { removeViewBox: false } },
      },
      // `xmlns` is not a valid react-native-svg prop.
      'removeXMLNS',
    ],
  },
};

/** arrow_down.svg → ArrowDown, ball_1.svg → Ball1 */
function toPascalCase(fileName) {
  return path
    .basename(fileName, '.svg')
    .split(/[-_\s.]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');
}

function toCamelCase(pascal) {
  return pascal[0].toLowerCase() + pascal.slice(1);
}

function writeIndex() {
  const names = fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => path.basename(f, '.tsx'))
    .sort();

  const imports = names.map((n) => `import ${n} from './${n}';`).join('\n');
  const entries = names.map((n) => `  ${toCamelCase(n)}: ${n},`).join('\n');

  fs.writeFileSync(
    INDEX_FILE,
    `${imports}\n\nexport const ICONS = {\n${entries}\n} as const;\n\nexport type IconName = keyof typeof ICONS;\n`,
  );
}

async function main() {
  if (!fs.existsSync(INPUT_DIR)) {
    fs.mkdirSync(INPUT_DIR, { recursive: true });
  }

  const svgFiles = fs.readdirSync(INPUT_DIR).filter((f) => f.endsWith('.svg'));

  if (svgFiles.length === 0) {
    console.log(`No .svg files in ${path.relative(ROOT, INPUT_DIR)}/`);
    return;
  }

  const written = [];
  const skipped = [];

  for (const file of svgFiles) {
    const name = toPascalCase(file);
    const outFile = path.join(OUTPUT_DIR, `${name}.tsx`);

    if (fs.existsSync(outFile) && !force) {
      skipped.push(name);
      continue;
    }

    const svg = fs.readFileSync(path.join(INPUT_DIR, file), 'utf8');
    const code = await transform(svg, svgrConfig, {
      componentName: `Svg${name}`,
      filePath: file,
    });

    fs.writeFileSync(outFile, code);
    written.push(path.relative(ROOT, outFile));
  }

  writeIndex();

  const toFormat = [...written, path.relative(ROOT, INDEX_FILE)];
  execFileSync('npx', ['eslint', '--fix', ...toFormat], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  execFileSync(
    'npx',
    ['prettier', '--write', '--log-level=warn', ...toFormat],
    {
      cwd: ROOT,
      stdio: 'inherit',
    },
  );

  console.log(`\n✅ Generated ${written.length} icon(s)`);
  written.forEach((f) => console.log(`   ${f}`));

  if (skipped.length) {
    console.log(
      `\n⏭️  Skipped ${skipped.length} existing icon(s) (use --force to overwrite):`,
    );
    console.log(`   ${skipped.join(', ')}`);
  }

  console.log(
    '\nYou can now delete the processed .svg files from assets/icons/.',
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
