import {test,expect} from '@playwright/test';

test.describe('Leaflet and buttons test', () =>{

    test('check the start, end buttons are working',async ({page}) =>{
        await page.goto('http://localhost:5173');

        await page.getByRole('link', {name: 'Planner'}).click();
        await expect(page).toHaveURL(/\/routes$/);

        await page.getByTestId('btn-create-route').click();

        const mapPointer = page.locator('.leaflet-container');

        expect(mapPointer).toBeVisible();

        const mapBound = await mapPointer.boundingBox();
        if (!mapBound) {
            throw new Error('The map is not visible.');
        }
        page.waitForTimeout(500);
        
        await page.getByTestId('btn-menuitem-nav-from').click();

        await page.mouse.click(mapBound.x + mapBound.width * 0.25, mapBound.y + mapBound.height * 0.5 );

        await page.waitForTimeout(1000);
        
        await page.getByTestId('btn-menuitem-nav-addwaypoint').click();

        await page.mouse.click(mapBound.x + mapBound.width * 0.33, mapBound.y + mapBound.height * 0.33 );

        await page.waitForTimeout(1000);
        
        await page.getByTestId('btn-menuitem-nav-to').click();

        await page.mouse.click(mapBound.x + mapBound.width * 0.75, mapBound.y + mapBound.height * 0.33 );

        await page.waitForTimeout(1000);

        let marker = page.locator('.leaflet-marker-icon');

        expect(marker).toHaveCount(3);
        
        await page.getByTestId('btn-menuitem-nav-clear').click();

        await page.waitForTimeout(1000);

        marker = page.locator('.leaflet-marker-icon');

        expect(marker).toHaveCount(0);
    });
});