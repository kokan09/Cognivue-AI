import express from "express";
import { scrapeWebsite } from "../controllers/scraper.controller.js";

const scraperRouter = express.Router();

scraperRouter.get("/", scrapeWebsite);

export default scraperRouter;