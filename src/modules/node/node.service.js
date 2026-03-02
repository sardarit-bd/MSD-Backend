import Node from "./node.model.js";
import mongoose from "mongoose";

const toObjectIdOrNull = (value) => {
  if (!value) return null;
  if (!mongoose.Types.ObjectId.isValid(value)) return null;
  return new mongoose.Types.ObjectId(value);
};

export const createNodeService = async (payload) => {
  const parentId = toObjectIdOrNull(payload.parentId);
  const node = await Node.create({ ...payload, parentId });
  return node;
};

export const getChildrenService = async ({ parentId, status }) => {
  const pid = toObjectIdOrNull(parentId);
  const filter = { parentId: pid };

  if (status) filter.status = status;

  return Node.find(filter).sort({ order: 1, createdAt: 1 });
};

export const getNodeByIdService = async (id) => {
  return Node.findById(id);
};

export const updateNodeService = async (id, payload) => {
  const parentId =
    payload.parentId !== undefined ? toObjectIdOrNull(payload.parentId) : undefined;

  const updateDoc = { ...payload };
  if (payload.parentId !== undefined) updateDoc.parentId = parentId;

  return Node.findByIdAndUpdate(id, updateDoc, { new: true });
};

export const deleteNodeRecursiveService = async (id) => {
  const root = await Node.findById(id);
  if (!root) return { deletedCount: 0 };

  // BFS delete
  const queue = [root._id];
  const allIds = [];

  while (queue.length) {
    const current = queue.shift();
    allIds.push(current);

    const children = await Node.find({ parentId: current }).select("_id");
    children.forEach((c) => queue.push(c._id));
  }

  const res = await Node.deleteMany({ _id: { $in: allIds } });
  return { deletedCount: res.deletedCount };
};

export const reorderSiblingsService = async ({ parentId, items }) => {
  const pid = toObjectIdOrNull(parentId);

  const bulk = items.map((it) => ({
    updateOne: {
      filter: { _id: it.id, parentId: pid },
      update: { $set: { order: it.order } },
    },
  }));

  await Node.bulkWrite(bulk);
  return { message: "Reordered successfully" };
};

export const resolveByPathService = async ({ slugs, onlyPublished = false }) => {
  let parentId = null;
  let current = null;

  for (const slug of slugs) {
    const filter = { parentId, slug };
    if (onlyPublished) filter.status = "published";

    current = await Node.findOne(filter);
    if (!current) return null;

    parentId = current._id;
  }

  return current;
};

export const getBreadcrumbService = async (nodeId) => {
  const chain = [];
  let current = await Node.findById(nodeId);

  while (current) {
    chain.unshift(current);
    if (!current.parentId) break;
    current = await Node.findById(current.parentId);
  }

  return chain;
};