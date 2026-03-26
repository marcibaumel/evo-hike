import {expect, test} from '@playwright/test'

test.describe('RouteTest', () =>{
    test('check the journal route exists', async({page}) =>{
        await page.goto("http://localhost:5173");
        await page.getByRole("link" ,{name : "Journal"}).click();
        await expect(page).toHaveURL(/\/journal$/);

        await expect(
            page.getByRole('heading', {name : "Alex Wanderer"})
        ).toBeVisible();

        await page.goBack();

        await expect(page).toHaveURL("http://localhost:5173");
        expect((await page.getByText('evoHike').all()).length).toBe(3);

    });
    test('check the social route exists', async({page}) =>{
        await page.goto("http://localhost:5173");
        await page.getByRole("link", {name: "Social"}).click();
        await expect(page).toHaveURL(/\/social$/);

        await expect(
            page.getByRole('heading', {name : "Sarah Jenkins"})
        ).toBeVisible();
        
        await page.goBack();

        await expect(page).toHaveURL("http://localhost:5173");
        expect((await page.getByText('evoHike').all()).length).toBe(3);
        
    });
    test('check the planner routes exists', async({page}) =>{
        await page.goto("http://localhost:5173");
        await page.getByRole("link", {name: "Planner"}).click();
        await expect(page).toHaveURL(/\/routes$/);
        
        await expect(
            page.getByRole('button', {name : "View Details"})
        ).toHaveCount(2);

        await page.goBack();

        await expect(page).toHaveURL("http://localhost:5173");
        expect((await page.getByText('evoHike').all()).length).toBe(3);
    });
});