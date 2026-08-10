async function scrapeWebsite(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const html = await response.text();

    const $ = cheerio.load(html);

    return {
        title: $("title").text().trim(),
        heading: $("h1").text().trim()
    };
}