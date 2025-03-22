import { AppError } from "../utils/index.utils.js";

const reqKeys = ["body", "params", "query", "file"];

export const validator = (schema) => {
  return (req, res, next) => {
    const errors = reqKeys.reduce((acc, key) => {
      if (schema[key]) {
        const { error } =
          schema[key]?.validate(req[key], { abortEarly: false }) || {};

        if (error) {
          acc.push(
            ...error.details.map((err) => ({
              label: err.context.label,
              message: err.message,
            }))
          );
        }
      }

      return acc;
    }, []);

    errors.length
      ? next(new AppError(422, "Validation Error", errors))
      : next();
  };
};
