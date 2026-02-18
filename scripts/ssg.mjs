
import { finalize } from './finalize-dist.js';
import { prerender } from './prerender.mjs';
import { validate } from './check-sitelinks-readiness.mjs';

async function run() {
    console.log('\n✨ Starting SSG Pipeline (Orchestrator)...');
    try {
        console.log('\n--- Step 1: Finalize Template ---');
        await finalize();

        console.log('\n--- Step 2: Prerender Routes ---');
        await prerender();

        console.log('\n--- Step 3: Validate output ---');
        await validate();

        console.log('\n✨ SSG Pipeline Completed Successfully!\n');
    } catch (error) {
        console.error('\n❌ SSG Pipeline Failed:', error);
        process.exit(1);
    }
}

run();
