import HttpError from "../helpers/HttpError.js";

const isEmptyBody = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(HttpError(400, "Request body is empty"));
  }
  next();
};

export default isEmptyBody;
