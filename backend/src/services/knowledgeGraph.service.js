import { generateNodes } from "./ai.service.js";
import KnowledgeGraph from "../models/KnowledgeGraph.js";

export async function createKnowledgeGraph(topic) {
  const graph = await generateNodes(topic);

  const existingGraph = await KnowledgeGraph.findOne({
    rootTopic: graph.rootTopic,
  });

  if (existingGraph) {
    return existingGraph;
  }

  const newGraph = await KnowledgeGraph.create(graph);

  return newGraph;
}