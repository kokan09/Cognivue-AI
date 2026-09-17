import express from "express";
import { createGraph } from "../controllers/knowledgeGraph.controller.js";

//Route /api/knowledge-graph
const router = express.Router();

router.post("/generate", createGraph);

export default router;