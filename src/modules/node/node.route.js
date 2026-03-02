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
} from "./node.controller.js";

import {
  createNodeValidation,
  updateNodeValidation,
  reorderValidation,
  resolvePathValidation,
} from "./node.validation.js";

const router = express.Router();

router.get("/", getChildren);

// resolve slug path -> node (public rendering)
router.post("/resolve", validate(resolvePathValidation), resolveByPath);

// breadcrumb chain
router.get("/:id/breadcrumb", breadcrumb);

// get single node
router.get("/:id", getNodeById);

router.post("/", protect, adminOnly, validate(createNodeValidation), createNode);
router.patch("/:id", protect, adminOnly, validate(updateNodeValidation), updateNode);
router.delete("/:id", protect, adminOnly, deleteNode);

router.post(
  "/reorder",
  protect,
  adminOnly,
  validate(reorderValidation),
  reorderSiblings
);

export default router;