import { isValidObjectId } from "mongoose";

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  next();
};
export default isValidId;
