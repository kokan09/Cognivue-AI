import axios from "axios";
import * as cheerio from "cheerio";

export const scrapeWebsite = async (url) => {
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    const title = $("title").text().trim();

    const headings = $("h1, h2, h3")
        .map((_, element) => $(element).text().trim())
        .get();

    const links = $("a")
        .map((_, element) => ({
            text: $(element).text().trim(),
            href: $(element).attr("href")
        }))
        .get();

    return {
        url,
        title,
        headings,
        links
    };
};