import HttpError from "./HttpError.js";

const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      console.log("Joi Error Details:", error.message);
      next(HttpError(400, error.message));
      return;
    }
    next();
  };

  return func;
};

export default validateBody;
