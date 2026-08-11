import * as cheerio from "cheerio";

export async function scrapeWebsite(req, res) {
    try {
        const { url } = req.query;

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

        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": "Cognivue-Scraper/1.0"
            },
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            return res.status(502).json({
                success: false,
                message: `Failed to fetch website: ${response.status}`
            });
        }

        const html = await response.text();

        const $ = cheerio.load(html);

        const title = $("title").first().text().trim();

        const mainHeading = $("h1").first().text().trim();

        const links = [];

        $("a").each((index, element) => {
            const href = $(element).attr("href");
            const text = $(element).text().trim();

            if (!href) return;

            try {
                const absoluteUrl = new URL(href, targetUrl).href;

                links.push({
                    text,
                    url: absoluteUrl
                });
            } catch (error) {
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                url: targetUrl.href,
                title,
                mainHeading,
                links
            }
        });

    } catch (error) {
        console.error("Scraper Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to scrape website"
        });
    }
}