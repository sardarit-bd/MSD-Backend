import mongoose from "mongoose";

const NodeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["section", "page", "group", "article"],
      required: true,
    },

    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
      default: null,
      index: true,
    },

    order: { type: Number, default: 0 },

    // Only for page/article (others can keep empty)
    contentHtml: { type: String, default: "" },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },

    // SEO
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

NodeSchema.index({ parentId: 1, slug: 1 }, { unique: true });

export default mongoose.models.Node || mongoose.model("Node", NodeSchema);