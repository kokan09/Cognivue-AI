import { chromium } from "playwright";

export async function getRenderedHtml(url) {
    let browser;

    try {
        browser = await chromium.launch({
            headless: true
        });

        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 15000
        });

        return await page.content();

    } finally {
        if (browser) {
            await browser.close();
        }
    }
}