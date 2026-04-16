import { expect, test } from '@playwright/test';
import { mockGeocodingResponse, mockWeatherResponse } from './mocks/geocodingResponses';

test.describe('WeatherPage', () => {
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

    test('should display weather forecast data', async ({ page }) => {
        await page.goto('http://localhost:5173/weather');

        await page.waitForSelector('text=Bükk Region');

        const mainHeading = page
            .getByRole('heading', {
                name: 'Weather Forecast'
            })
            .first();

        const location = page.getByText('Bükk Region, Hungary');
        const currentWeatherCard = page.getByTestId('current-weather-card');
        const currentTemperature = currentWeatherCard.getByTestId('current-temperature');

        await expect(mainHeading).toBeVisible();
        await expect(location).toBeVisible();
        await expect(currentWeatherCard).toBeVisible();
        await expect(currentTemperature).toBeVisible();
        await expect(currentTemperature).toContainText('14');
    });

    test('should display weather statistics', async ({ page }) => {
        await page.goto('http://localhost:5173/weather');

        const windValue = await page.getByTestId('weather-stat-wind-value');
        const humidityValue = await page.getByTestId('weather-stat-humidity-value');
        const precipitationLabel = page.getByText('Precipitation Chance');

        await expect(windValue).toBeVisible();
        await expect(windValue).toContainText('3.33');
        await expect(humidityValue).toBeVisible();
        await expect(humidityValue).toContainText('0');
        await expect(precipitationLabel).toBeVisible();
    });

    test('should handle rain probability display', async ({ page }) => {
        await page.goto('http://localhost:5173/weather');

        await page.waitForSelector('text=Precipitation Chance');

        const dryStatus = page.getByText('Likely Dry');
        await expect(dryStatus).toBeVisible();
    });

    test.describe('when I press refresh button', () => {
        test('then I should see the data is refetched', async ({ page }) => {
            let geocodingApiCallCount = 0;
            let weatherApiCallCount = 0;

            await page.route('**/geocoding-api.open-meteo.com/**', async (route) => {
                geocodingApiCallCount++;
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockGeocodingResponse)
                });
            });

            await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
                weatherApiCallCount++;
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockWeatherResponse)
                });
            });

            await page.goto('http://localhost:5173/weather');

            const initialGeocodingCalls = geocodingApiCallCount;
            const initialWeatherCalls = weatherApiCallCount;

            expect(geocodingApiCallCount).toBe(2);
            expect(weatherApiCallCount).toBe(2);

            const refreshButton = page.getByRole('button', { name: 'Refresh' });

            await expect(refreshButton).toBeVisible();
            await expect(refreshButton).toBeEnabled();


            await refreshButton.click();
            await page.waitForTimeout(500);

            expect(geocodingApiCallCount).toBe(initialGeocodingCalls + 1);
            expect(weatherApiCallCount).toBe(initialWeatherCalls + 1);
        });
    });


    test('should handle API errors gracefully', async ({ page }) => {
        await page.route('**/api.open-meteo.com/**', (route) => {
            route.abort('failed');
        });
        await page.goto('http://localhost:5173/weather');

        const errorMessage = page.getByTestId('weather-page-network-error');
        const retryButton = page.getByRole('button', { name: 'Retry' });

        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Failed to load forecast');
        await expect(retryButton).toBeVisible();
    });
});
