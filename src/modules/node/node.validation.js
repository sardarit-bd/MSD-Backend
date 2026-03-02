import Joi from "joi";

export const createNodeValidation = Joi.object({
  type: Joi.string().valid("section", "page", "group", "article").required(),
  title: Joi.string().min(2).required(),
  slug: Joi.string().min(1).required(),
  parentId: Joi.string().allow(null, "").optional(),
  order: Joi.number().integer().min(0).optional(),
  contentHtml: Joi.string().allow("").optional(),
  status: Joi.string().valid("draft", "published").optional(),
  metaTitle: Joi.string().allow("").optional(),
  metaDescription: Joi.string().allow("").optional(),
});

export const updateNodeValidation = Joi.object({
  type: Joi.string().valid("section", "page", "group", "article").optional(),
  title: Joi.string().min(2).optional(),
  slug: Joi.string().min(1).optional(),
  parentId: Joi.string().allow(null, "").optional(),
  order: Joi.number().integer().min(0).optional(),
  contentHtml: Joi.string().allow("").optional(),
  status: Joi.string().valid("draft", "published").optional(),
  metaTitle: Joi.string().allow("").optional(),
  metaDescription: Joi.string().allow("").optional(),
});

export const reorderValidation = Joi.object({
  parentId: Joi.string().allow(null, "").optional(),
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        order: Joi.number().integer().min(0).required(),
      })
    )
    .min(1)
    .required(),
});

export const resolvePathValidation = Joi.object({
  slugs: Joi.array()
    .items(Joi.string().min(1))
    .min(1)
    .required(),

  onlyPublished: Joi.boolean().optional(),
});