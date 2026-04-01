
import { expect, test} from '@playwright/test';

test.describe('SocialPost', () => {
    test('renders post content correctly', async ({ page }) => {
        await page.goto('http://localhost:5173/');
        expect((await page.getByText('evoHike').all()).length).toBe(3);
    });
});