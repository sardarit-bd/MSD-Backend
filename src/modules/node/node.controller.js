import {
  createNodeService,
  getChildrenService,
  getNodeByIdService,
  updateNodeService,
  deleteNodeRecursiveService,
  reorderSiblingsService,
  resolveByPathService,
  getBreadcrumbService,
} from "./node.service.js";

export const createNode = async (req, res, next) => {
  try {
    const node = await createNodeService(req.body);
    res.status(201).json(node);
  } catch (e) {
    next(e);
  }
};

export const getChildren = async (req, res, next) => {
  try {
    const { parentId, status } = req.query;
    const nodes = await getChildrenService({ parentId, status });
    res.json(nodes);
  } catch (e) {
    next(e);
  }
};

export const getNodeById = async (req, res, next) => {
  try {
    const node = await getNodeByIdService(req.params.id);
    if (!node) return res.status(404).json({ message: "Node not found" });
    res.json(node);
  } catch (e) {
    next(e);
  }
};

export const updateNode = async (req, res, next) => {
  try {
    const node = await updateNodeService(req.params.id, req.body);
    if (!node) return res.status(404).json({ message: "Node not found" });
    res.json(node);
  } catch (e) {
    next(e);
  }
};

export const deleteNode = async (req, res, next) => {
  try {
    const result = await deleteNodeRecursiveService(req.params.id);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const reorderSiblings = async (req, res, next) => {
  try {
    const result = await reorderSiblingsService(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

// Public resolve endpoint
export const resolveByPath = async (req, res, next) => {
  try {
    const { slugs, onlyPublished } = req.body;
    const node = await resolveByPathService({
      slugs,
      onlyPublished: Boolean(onlyPublished),
    });
    if (!node) return res.status(404).json({ message: "Not found" });
    res.json(node);
  } catch (e) {
    next(e);
  }
};

export const breadcrumb = async (req, res, next) => {
  try {
    const chain = await getBreadcrumbService(req.params.id);
    res.json(chain);
  } catch (e) {
    next(e);
  }
};