import { readFileSync, writeFileSync, cpSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { minify } from 'terser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Copy public to dist.
console.log('Copying public/ to dist/...');
cpSync(join(rootDir, 'public'), join(rootDir, 'dist'), { recursive: true });

// Copy src to dist.
console.log('Copying src/ to dist/...');
cpSync(join(rootDir, 'src'), join(rootDir, 'dist'), { recursive: true });

// Replace HEAD_TAGS placeholder in HTML if JSPACMAN_HEAD_TAGS exists.
const htmlPath = join(rootDir, 'dist', 'index.html');
if (process.env.JSPACMAN_HEAD_TAGS) {
    console.log('Replacing HEAD_TAGS placeholder...');
    let html = readFileSync(htmlPath, 'utf8');
    html = html.replace('<!-- HEAD_TAGS -->', process.env.JSPACMAN_HEAD_TAGS);
    writeFileSync(htmlPath, html, 'utf8');
}

// Minify JS files.
console.log('Minifying JS files...');
async function minifyDir(dir) {
    for (const entry of readdirSync(dir)) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            await minifyDir(fullPath);
        } else if (stat.isFile() && extname(entry) === '.js') {
            const code = readFileSync(fullPath, 'utf8');
            const result = await minify(code, { compress: true, mangle: true });
            if (result.code) writeFileSync(fullPath, result.code, 'utf8');
        }
    }
}

await minifyDir(join(rootDir, 'dist'));

console.log('Build complete!');

