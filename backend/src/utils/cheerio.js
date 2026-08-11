import * as cheerio from "cheerio";

export async function getHtmlWithCheerio(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch website: ${response.status}`);
    }

    return await response.text();
}

export function parseHtml(html, targetUrl) {
    const $ = cheerio.load(html);

    const title = $("title").first().text().trim();

    const mainHeading = $("h1").first().text().trim();

    const links = [];

    $("a").each((index, element) => {
        const href = $(element).attr("href");
        const text = $(element).text().trim();

        if (!href) return;

        try {
            links.push({
                text,
                url: new URL(href, targetUrl).href
            });
        } catch (error) {
        }
    });

    return {
        title,
        mainHeading,
        links
    };
}