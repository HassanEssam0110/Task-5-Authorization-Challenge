import { asyncHandler } from "../middlewares/index.middlewares.js";
import { AppError } from "../utils/index.utils.js";

// ?==> Helpers
const sendError = (statusCode, next, message) => {
  return next(new AppError(statusCode, message));
};

const sendResponse = (statusCode, res, data) => {
  const results = data?.length || undefined;
  return res.status(statusCode).json({
    status: "success",
    results,
    data,
  });
};

const hardDelete = async (Model, req, res, next) => {
  const doc = await Model.findOneAndDelete({ _id: req.params.id });
  // Not found
  if (!doc) {
    return sendError(404, next, `${Model.modelName} not found`);
  }

  // Send Response
  return sendResponse(204, res);
};

const softDelete = async (Model, req, res, next) => {
  const doc = await Model.findOneAndUpdate(
    { _id: req.params.id, isDeleted: { $ne: true } },
    { isDeleted: true, deletedAt: Date.now() },
    {
      new: true,
    }
  );

  // Not found
  if (!doc) {
    return sendError(
      404,
      next,
      `${Model.modelName} not found or already deleted`
    );
  }

  // Send Response
  return sendResponse(204, res);
};

// ?==> CRUD Operations Handlers <===

const getAll = (Model, populateOptions) => {
  return asyncHandler(async (req, res, next) => {
    const query = Model.find({ isDeleted: { $ne: true } });
    if (populateOptions) query.populate(populateOptions);

    const docs = await query;

    // SEND Response
    return sendResponse(200, res, docs);
  });
};

const getOne = (Model, populateOptions) => {
  return asyncHandler(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (populateOptions) query.populate(populateOptions);
    const doc = await query;

    // SEND Error
    if (!doc || doc.isDeleted)
      return sendError(404, next, `${Model.modelName} not found`);

    // SEND Response
    return sendResponse(200, res, doc);
  });
};

const createOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const doc = await Model.create(req.body);

    // SEND Error
    if (!doc)
      return sendError(500, next, `Failed to create a new ${Model.modelName}`);

    // SEND Response
    return sendResponse(201, res, doc);
  });
};

const updateOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // SEND Error
    if (!doc || doc.isDeleted)
      return sendError(404, next, `${Model.modelName} not found`);

    // SEND Response
    return sendResponse(200, res, doc);
  });
};

const deleteOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    // use hard delete
    if (req.query.softDelete === "false")
      return await hardDelete(Model, req, res, next);

    // use soft delete
    return await softDelete(Model, req, res, next);
  });
};

export { getAll, getOne, createOne, updateOne, deleteOne };
