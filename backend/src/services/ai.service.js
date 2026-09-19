import { ChatOllama } from "@langchain/ollama";
import {
  SystemMessage,
  HumanMessage,
} from "@langchain/core/messages";

const ollamaModel = new ChatOllama({
  model: "llama3.2",
  temperature: 0,
  maxRetries: 2,
});

export async function generateNodes(topic) {
  const resp = await ollamaModel.invoke([
    new SystemMessage(`
    You are an expert curriculum designer and knowledge graph generator.

    Your  task is to take a learning topic and generate a structured
    learning graph containing the main topic, its subtopics, and
    the prerequisite relationships between them.

    Rules:
    1. Start with the main topic as the root node.
    2. Break the topic into meaningful learning topics.
    3. Each topic can have subtopics.
    4. Do not generate unnecessary or unrelated topics.
    5. Arrange topics from beginner to advanced.
    6. Identify prerequisite relationships.
    7. Every node must have a unique id.
    8. Return ONLY valid JSON.
    9. Do not include markdown, explanations, or code fences.

    Return JSON in this exact format:

    {
    "rootTopic": "string",
    "nodes": [
        {
        "id": "string",
        "title": "string",
        "description": "string",
        "level": 0,
        "parentId": null,
        "prerequisites": []
        }
    ],
    "edges": [
        {
        "from": "string",
        "to": "string",
        "relationship": "prerequisite"
        }
    ]
    }

    The root node must have:
    - level: 0
    - parentId: null
    - prerequisites: []

All other nodes must have a parentId.
`),

    new HumanMessage(`
Generate a learning graph for the following topic:

${topic}
`),
  ]);

  const content = Array.isArray(resp.content)
    ? resp.content
        .map((block) => (typeof block === "string" ? block : block.text ?? ""))
        .join("")
    : resp.content;

  const json = content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let graph;

  try {
    graph = JSON.parse(json);
  } catch (error) {
    throw new Error("Ollama returned invalid knowledge graph JSON", {
      cause: error,
    });
  }

  if (
    !graph ||
    typeof graph !== "object" ||
    typeof graph.rootTopic !== "string" ||
    !Array.isArray(graph.nodes) ||
    !Array.isArray(graph.edges)
  ) {
    throw new Error("Ollama returned an invalid knowledge graph structure");
  }

  return graph;
}

// Example
// const graph = await generateNodes("JavaScript");

// console.log(graph);

