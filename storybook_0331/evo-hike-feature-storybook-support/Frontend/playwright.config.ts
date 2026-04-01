import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: '.',
    testMatch: ['**/test/**/*.spec.ts', '**/tests/**/*.spec.ts', '**/__test__/**/*.spec.ts'],
    fullyParallel: true,
    reporter: 'html',
    use: {
        // baseURL: 'http://localhost:5173',
        trace: 'on-first-retry'
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        }
    ],

    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173'
    }
});
