import { expect, test } from '@playwright/test';

test.describe('Responsive weather page', () =>{
    test('check weather card',async ({page, isMobile}) =>{
        await page.goto('http://localhost:5173/weather');

        const weatherCard = page.getByTestId('current-weather-card');

        if (isMobile) {
            await expect(weatherCard).toHaveCSS('postion', 'relative');
        }
        else{
            await expect(weatherCard).toHaveCSS('grid-row-start','span 2');
        }
    });
});