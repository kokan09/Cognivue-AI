import mongoose from "mongoose";

const knowledgeGraphSchema = new mongoose.Schema(
  {
    rootTopic: {
      type: String,
      required: true,
      unique: true,
    },

    nodes: [
      {
        id: {
          type: String,
          required: true,
        },

        title: {
          type: String,
          required: true,
        },

        description: String,

        level: Number,

        parentId: {
          type: String,
          default: null,
        },

        prerequisites: [
          {
            type: String,
          },
        ],
      },
    ],

    edges: [
      {
        from: String,
        to: String,
        relationship: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "KnowledgeGraph",
  knowledgeGraphSchema
);