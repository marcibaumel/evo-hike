import { Page } from '@playwright/test';

export const authenticatePage = async (page: Page) => {
    await page.addInitScript(() => {
        localStorage.setItem('token', 'dummy-auth-token-for-testing');
    });
};
