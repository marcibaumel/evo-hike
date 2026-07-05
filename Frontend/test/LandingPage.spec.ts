import { test, expect, Page, Locator } from '@playwright/test';
import { authenticatePage } from './auth.setup';

async function openMobileMenu(page: Page) {
    const menuToggle = page.getByTestId('mobile-menu-toggle');
    await expect(menuToggle).toBeVisible();
    await menuToggle.click();
    return page.getByTestId('mobile-menu-dropdown');
}

async function openLanguageSwitcher(parent: Page | Locator) {
    const langSwitcher = parent.getByTestId('lang-switcher-toggle');
    await langSwitcher.click();
    return parent.getByTestId('lang-dropdown');
}

async function checkPrivateLinks(dropdown: Locator, shouldBeVisible: boolean) {
    const privateRoutes = ['/routes', '/weather', '/journal', '/social'];

    for (const route of privateRoutes) {
        const linkLocator = dropdown.locator(`a[href="${route}"]`);
        if (shouldBeVisible) {
            await expect(linkLocator).toBeVisible();
        } else {
            await expect(linkLocator).toBeHidden();
        }
    }
}

test.describe('Mobile view Navbar tests', () => {
    test.use({ locale: 'hu-HU', viewport: { width: 390, height: 844 } });

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/');
        await page.waitForLoadState('domcontentloaded');
    });

    test('When Logged out, the Log in button is visible and restricted links are hidden', async ({ page }) => {
        const dropdown = await openMobileMenu(page);

        await expect(dropdown.getByTestId('btn-login')).toBeVisible();
        await expect(dropdown.getByTestId('btn-logout')).toBeHidden();

        await checkPrivateLinks(dropdown, false);
    });

    test('When Logged in, the Logout button and the links are visible', async ({ page }) => {
        await authenticatePage(page);
        await page.goto('http://localhost:5173/');

        const dropdown = await openMobileMenu(page);

        await expect(dropdown.getByTestId('btn-logout')).toBeVisible();
        await expect(dropdown.getByTestId('btn-login')).toBeHidden();

        await checkPrivateLinks(dropdown, true);
    });

    test('Clicking the language switcher displays both language options', async ({ page }) => {
        const menuDropdown = await openMobileMenu(page);

        const langDropdown = await openLanguageSwitcher(menuDropdown);
        await expect(langDropdown).toBeVisible();
        const huOption = page.getByTestId('lang-option-HU');
        const enOption = page.getByTestId('lang-option-EN');

        await expect(huOption).toBeVisible();
        await expect(enOption).toBeVisible();
    });

    test('Changing language to Hungarian actually updates the UI text', async ({ page }) => {
        const menuDropdown = await openMobileMenu(page);

        const loginButton = menuDropdown.getByTestId('btn-login');
        await expect(loginButton).toHaveText(/Bejelentkezés/i);

        const langDropdown = await openLanguageSwitcher(menuDropdown);
        await langDropdown.getByTestId('lang-option-EN').click();

        await expect(loginButton).toHaveText(/Login/i);
    });

    test('On desktop the navbar is visible and the hamburger menu is hidden', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 720 });
        await authenticatePage(page);
        await page.goto('http://localhost:5173/');

        await expect(page.getByTestId('desktop-navbar')).toBeVisible();

        await expect(page.getByTestId('mobile-menu-toggle')).toBeHidden();
    });
});