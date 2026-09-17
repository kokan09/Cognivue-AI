import { createKnowledgeGraph } from "../services/knowledgeGraph.service.js";

/**
 * @route POST /api/knowledge-graph/generate
 * @param {topic} req.topic
 * @param {*} res 
 * @returns 
 */
export async function createGraph(req, res) {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        message: "Topic is required",
      });
    }

    const graph = await createKnowledgeGraph(topic);

    res.status(201).json({
      message: "Knowledge graph created successfully",
      graph,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create knowledge graph",
    });
  }
}