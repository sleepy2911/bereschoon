
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_INDEX = path.resolve(__dirname, '../dist/index.html');
const SRC_INDEX = path.resolve(__dirname, '../index.html');
const LOG_FILE = path.resolve(__dirname, '../finalize_debug.log');

function log(msg) {
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

function finalize() {
    log('Starting finalize-dist.js...');

    if (!fs.existsSync(DIST_INDEX)) {
        log('Error: dist/index.html not found at ' + DIST_INDEX);
        process.exit(1);
    }

    // 1. Read dist/index.html to get asset links
    try {
        const distContent = fs.readFileSync(DIST_INDEX, 'utf-8');
        log(`Read dist/index.html (${distContent.length} bytes)`);

        const scriptRegex = /<script[^>]+src="\/assets\/[^"]+"[^>]*><\/script>/g;
        const styleRegex = /<link[^>]+href="\/assets\/[^"]+"[^>]*>/g;

        const scripts = distContent.match(scriptRegex) || [];
        const styles = distContent.match(styleRegex) || [];

        log(`Found ${scripts.length} scripts`);
        log(`Found ${styles.length} styles`);

        // 2. Read src/index.html (correct template)
        let srcContent = fs.readFileSync(SRC_INDEX, 'utf-8');
        log(`Read src/index.html (${srcContent.length} bytes)`);

        // 3. Inject assets
        const assetsHtml = [...styles, ...scripts].join('\n    ');

        if (srcContent.includes('</head>')) {
            srcContent = srcContent.replace('</head>', `    ${assetsHtml}\n  </head>`);
        } else {
            log('Error: </head> not found in src/index.html');
            process.exit(1);
        }

        // 4. Remove dev script
        const devScriptRegex = /<script type="module" src="\/src\/main\.jsx"><\/script>/;
        if (devScriptRegex.test(srcContent)) {
            srcContent = srcContent.replace(devScriptRegex, '');
            log('Removed dev script');
        }

        // 5. Write to index.template.html
        const TEMPLATE_INDEX = path.resolve(__dirname, '../dist/index.template.html');
        fs.writeFileSync(TEMPLATE_INDEX, srcContent, 'utf-8');
        log(`Successfully wrote to ${TEMPLATE_INDEX} (${srcContent.length} bytes)`);

    } catch (error) {
        log('ERROR: ' + error.message);
        process.exit(1);
    }
}

export { finalize };
