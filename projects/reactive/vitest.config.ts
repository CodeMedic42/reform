import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        include: ['shortid'],
    },
    test: {
        browser: {
            enabled: true,
            provider: playwright({
                trace: 'retain-on-failure',
            }),
            screenshotFailures: true,
            screenshotDirectory: './test-screenshots',
            instances: [{ browser: 'chromium' }],
        },
        reporters: ['default', 'json'],
        outputFile: { json: './test-results.json' },
        include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
        exclude: ['src/hooks/**'],
    },
});
