import { getHtmlWithCheerio, parseHtml } from "../utils/cheerio.js";
import { getRenderedHtml } from "../utils/playwright.js";

export async function scrapeWebsite(req, res) {
    try {
        const { url, mode = "playwright" } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required"
            });
        }

        let targetUrl;

        try {
            targetUrl = new URL(url);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid URL"
            });
        }

        if (!["http:", "https:"].includes(targetUrl.protocol)) {
            return res.status(400).json({
                success: false,
                message: "Only HTTP and HTTPS URLs are supported"
            });
        }

        let html;

        if (mode === "cheerio") {
            html = await getHtmlWithCheerio(targetUrl.href);
        } else if (mode === "playwright") {
            html = await getRenderedHtml(targetUrl.href);
        } else {
            return res.status(400).json({
                success: false,
                message: "Mode must be cheerio or playwright"
            });
        }

        const data = parseHtml(html, targetUrl);

        return res.status(200).json({
            success: true,
            mode,
            data
        });

    } catch (error) {
        console.error("Scraper Error:", error);

        if (error.name === "TimeoutError") {
            return res.status(504).json({
                success: false,
                message: "Website took too long to load"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to scrape website"
        });
    }
}