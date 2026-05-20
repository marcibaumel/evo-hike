import { expect, test } from '@playwright/test';

test.describe('Responsive weather page', () =>{
    test('check weather card',async ({page, isMobile}) =>{
        await page.goto('http://localhost:5173/weather');

        const weatherCard = page.getByTestId('current-weather-card');
        const weatherCelsius = page.getByTestId('weather-celsius');
        const weatherContainer = page.getByTestId('weather-container');
        await page.getByTestId('weather-container').waitFor({state : 'visible'});
        const weatherString = page.getByTestId('weather-string');
        const rowsAndGrid = page.getByTestId('row-and-grid');

        await expect(weatherContainer).toHaveCSS('display', 'flex');
        await expect(weatherCelsius).toHaveCSS('display', 'flex');

        let columnCount = 0;

        if (isMobile) {
            await expect(weatherCard).toHaveCSS('position', 'relative');
            await expect(weatherString).toHaveCSS('top', '20px');
            await expect(weatherString).toHaveCSS('left', '32px');

            columnCount = await rowsAndGrid.evaluate((el) =>{
                return window.getComputedStyle(el).getPropertyValue('grid-template-columns').split(' ').length;
            });
            expect(columnCount).toBe(1);
        } else {
            await expect(weatherCard).toHaveCSS('grid-row-start','span 2');
            await expect(weatherString).toHaveCSS('top', '32px');
            await expect(weatherString).toHaveCSS('left', '32px');
            columnCount = await rowsAndGrid.evaluate((el) =>{
                return window.getComputedStyle(el).getPropertyValue('grid-template-columns').split(' ').length;
            });
            expect(columnCount).toBe(4);
        }
    });
});
