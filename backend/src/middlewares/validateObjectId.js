import mongoose from "mongoose";

//define a middleware function to validate the object id of the post before updating or deleting it. If the id is invalid, return an error response with status code 400 and message "Invalid post id". If the id is valid, call the next middleware function.
const validateObjectId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const error = new Error("Invalid post id");
    error.statusCode = 400;
    return next(error);
  }

  next();
};

export default validateObjectId;