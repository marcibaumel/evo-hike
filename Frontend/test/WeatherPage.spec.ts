import { expect, test } from '@playwright/test';
import { mockGeocodingResponse, mockWeatherResponse } from './mocks/geocodingResponses';


test.describe('WeatherPage', () => {
    test.beforeEach(async ({ page }) => {
        // Intercept and mock the geocoding API call
        await page.route('https://geocoding-api.open-meteo.com/**', (route) => {
            route.abort('Blocked by client');
        });

        await page.route('**/geocoding-api.open-meteo.com/**', (route) => {
            route.abort('Blocked by client');
        });

        // Intercept all requests and respond with mock data
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

    test('should display weather forecast data', async ({ page }) => {
        await page.goto('http://localhost:5173/weather');

        await page.waitForSelector('text=/Miskolc|Bükk Region/');

        // TODO: add translation
        const mainHeading = page.getByRole('heading', {
            name: /Időjárás előrejelzés|Weather Forecast/i
        }).first();
        await expect(mainHeading).toBeVisible();

        // TODO: add translation
        const location = page.getByText(/Bükk Region, Hungary/);
        await expect(location).toBeVisible();

        const currentWeatherCard = page.locator('[class*="md:col-span-2"][class*="md:row-span-2"]').first();
        await expect(currentWeatherCard).toBeVisible();

        const temperature = page.locator('text=/°C|°|C/').first();
        await expect(temperature).toBeVisible();
    });

    test('should display weather statistics', async ({ page }) => {
        await page.goto('http://localhost:5173/weather');

        // TODO: add translation
        await page.waitForSelector('text=/Wind|Szél/i');

        // TODO: add translation
        const windLabel = page.getByText(/Wind|Szél/i).first();
        await expect(windLabel).toBeVisible();

        // TODO: add translation
        const humidityLabel = page.getByText(/Humidity|Páratartalom/i).first();
        await expect(humidityLabel).toBeVisible();

        // TODO: add translation
        const precipLabel = page.getByText(/Precipitation chance|Csapadék esélye/i);
        await expect(precipLabel).toBeVisible();
    });

    test('should handle rain probability display', async ({ page }) => {
        await page.goto('http://localhost:5173/weather');

        // TODO: add translation
        await page.waitForSelector('text=/Precipitation chance|Csapadék esélye/i');

        // TODO: add translation
        const dryStatus = page.getByText(/Likely dry|Valószínűleg száraz/i);
        await expect(dryStatus).toBeVisible();
    });

    test('should display upcoming forecast grid', async ({ page }) => {
        await page.goto('http://localhost:5173/weather');

        await page.waitForLoadState('networkidle');

        const forecastItems = page.locator('div').filter({ hasText: /°.*rain/i });

        const count = await forecastItems.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should have a refresh button that refetches data', async ({ page }) => {
        await page.goto('http://localhost:5173/weather');

        // TODO: add translation
        await page.waitForSelector('text=/Bükk Region/');

        // TODO: add translation
        const refreshButton = page.getByRole('button', { name: /Refresh|Frissítés/i });

        await expect(refreshButton).toBeVisible();
        await expect(refreshButton).toBeEnabled();

        const responsePromise = page.waitForEvent('response', (response) =>
            response.url().includes('open-meteo.com')
        );


        await refreshButton.click();
        await responsePromise;
        // TODO: add translation
        await expect(page.getByText(/Bükk Region/)).toBeVisible();
    });

    test('should handle API errors gracefully', async ({ page }) => {
        await page.route('**/api.open-meteo.com/**', (route) => {
            route.abort('failed');
        });

        await page.goto('http://localhost:5173/weather');

        await page.waitForSelector('text=/Error|Hiba/', { timeout: 5000 });

        // TODO: add translation
        const errorHeading = page.getByText(/Failed to load|Nem sikerült betölteni/i);
        await expect(errorHeading).toBeVisible();

        // TODO: add translation
        const retryButton = page.getByRole('button', { name: /Retry|Újra próbálkozás/i });
        await expect(retryButton).toBeVisible();
    });

    test('should show loading state initially', async ({ page }) => {
        await page.route('**/api.open-meteo.com/**', async (route) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await route.continue();
        });

        const navigationPromise = page.goto('http://localhost:5173/weather');

        const skeletons = page.locator('[class*="skeleton"], [class*="Skeleton"]');
        const skeletonCount = await skeletons.count();

        if (skeletonCount > 0) {
            await expect(skeletons.first()).toBeVisible();
        }

        await navigationPromise;
        await page.waitForSelector('text=/Bükk Region/');
    });
});