import { scrapeWebsite } from "./cheerioScraper.js"

const result = await scrapeWebsite("https://cheerio.js.org/docs/intro/");

console.log(result);