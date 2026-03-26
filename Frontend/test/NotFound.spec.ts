import { expect, test} from '@playwright/test';

test.describe('NotFound', () => {

    test('should display the 404 page for a non-existent route', async ({ page }) => {
        await page.goto('http://localhost:5173/asdasd');
        
        const watermark = page.getByText('404', { exact: true });
        await expect(watermark).toBeVisible();
        
        const mainHeading = page.getByRole('heading', {
            name: /Hoppá! Az oldal nem található\.|Oops! Page not found\./i
        });
        await expect(mainHeading).toBeVisible();
        
        const description = page.locator('text=/letértél a térképről|gone off the map/i');
        await expect(description).toBeVisible();
    });

    test('should navigate back to the home page when the back button is clicked', async ({ page }) => {
        await page.goto('http://localhost:5173/asdasd');
        
        const backToHomeLink = page.getByRole('link', {
            name: /Vissza a főoldalra|Back to home/i
        });
        await expect(backToHomeLink).toBeVisible();
        
        await backToHomeLink.click();
        
        await expect(page).toHaveURL('http://localhost:5173/');
    });

});