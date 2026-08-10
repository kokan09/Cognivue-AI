import express from "express";
import { scrapeWebsite } from "../scraper/scraperController.js";

const scraperRouter = express.Router();

scraperRouter.post("/", async (req, res) => {
    // something
});

export default scraperRouter;