import express from "express";
import { protect, adminOnly } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  createNode,
  getChildren,
  getNodeById,
  updateNode,
  deleteNode,
  reorderSiblings,
  resolveByPath,
  breadcrumb,
  getFullTree,
  getNavigationTree,
} from "./node.controller.js";

import {
  createNodeValidation,
  updateNodeValidation,
  reorderValidation,
  resolvePathValidation,
} from "./node.validation.js";

const router = express.Router();

/* ---------- PUBLIC ROUTES (Specific First) ---------- */


console.log("Node routes loaded");

// Navigation tree
router.get("/navigation", getNavigationTree);

// Full tree
router.get("/tree", getFullTree);

// Resolve slug path (IMPORTANT: before :id)
router.post(
  "/resolve",
  validate(resolvePathValidation),
  resolveByPath
);

// Breadcrumb
router.get("/:id/breadcrumb", breadcrumb);

// Get children list
router.get("/", getChildren);

// Get single node by ID (ALWAYS LAST dynamic GET)
router.get("/:id", getNodeById);

/* ---------- ADMIN ROUTES ---------- */

router.post(
  "/",
  protect,
  adminOnly,
  validate(createNodeValidation),
  createNode
);

router.patch(
  "/:id",
  protect,
  adminOnly,
  validate(updateNodeValidation),
  updateNode
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteNode
);

router.post(
  "/reorder",
  protect,
  adminOnly,
  validate(reorderValidation),
  reorderSiblings
);

export default router;