import mongoose from "mongoose";
import Node from "./node.model.js";

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

export const getFullTreeService = async ({ onlyPublished = false }) => {
  const filter = onlyPublished ? { status: "published" } : {};

  const nodes = await Node.find(filter)
    .sort({ order: 1, createdAt: 1 })
    .lean();

  const map = {};
  const roots = [];

  // Initialize map
  nodes.forEach((node) => {
    map[node._id] = { ...node, children: [] };
  });

  // Build tree
  nodes.forEach((node) => {
    if (node.parentId) {
      map[node.parentId]?.children.push(map[node._id]);
    } else {
      roots.push(map[node._id]);
    }
  });

  return roots;
};

export const getNavigationTreeService = async () => {
  const rootNodes = await Node.find({
    parentId: null,
    status: "published"
  }).sort({ order: 1 });

  const buildTree = async (parent) => {
    const children = await Node.find({
      parentId: parent._id,
      status: "published"
    }).sort({ order: 1 });

    return Promise.all(
      children.map(async (child) => ({
        ...child.toObject(),
        children: await buildTree(child)
      }))
    );
  };

  return Promise.all(
    rootNodes.map(async (root) => ({
      ...root.toObject(),
      children: await buildTree(root)
    }))
  );
};