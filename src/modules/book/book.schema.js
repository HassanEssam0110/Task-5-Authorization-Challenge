import Joi from "joi";
import { generalRoles } from "../../utils/index.utils.js";

const createBookSchema = {
  body: Joi.object({
    title: generalRoles.title.required(),
    author: generalRoles.author.required(),
    publishedDate: generalRoles.publishedDate.required(),
  }),
};

const getBookSchema = {
  params: Joi.object({
    id: generalRoles.id.required(),
  }),
};

const updateBookSchema = {
  params: Joi.object({
    id: generalRoles.id.required(),
  }),
  body: Joi.object({
    title: generalRoles.title.optional(),
    author: generalRoles.author.optional(),
    publishedDate: generalRoles.publishedDate.optional(),
  }),
};

const deleteBookSchema = {
  params: Joi.object({
    id: generalRoles.id.required(),
  }),
};

export { createBookSchema, getBookSchema, updateBookSchema, deleteBookSchema };
