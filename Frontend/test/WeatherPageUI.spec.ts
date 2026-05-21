import { expect, test } from '@playwright/test';
import { mockGeocodingResponse, mockWeatherResponse } from './mocks/geocodingResponses';

test.describe('Responsive weather page', () =>{
    test.beforeEach(async ({ page }) => {
        await page.route('**/*', async (route) => {
            const url = route.request().url();

            if (url.includes('geocoding-api.open-meteo.com')) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockGeocodingResponse)
                });
            } else if (url.includes('api.open-meteo.com')) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockWeatherResponse)
                });
            } else {
                await route.continue();
            }
        });
    });

    test('check weather card',async ({page, isMobile}) =>{
        await page.goto('http://localhost:5173/weather');

        const weatherCard = page.getByTestId('current-weather-card');
        const weatherCelsius = page.getByTestId('weather-celsius');
        const weatherContainer = page.getByTestId('weather-container');
        const weatherString = page.getByTestId('weather-string');
        const rowsAndGrid = page.getByTestId('row-and-grid');

        await weatherContainer.waitFor({ state: 'visible' });

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
