const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body || {};

  if (typeof username !== "string" || username.trim().length < 2) {
    return next(createValidationError("Username must be at least 2 characters"));
  }
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return next(createValidationError("A valid email is required"));
  }
  if (typeof password !== "string" || password.length < 6 || password.length > 50) {
    return next(createValidationError("Password must be between 6 and 50 characters"));
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return next(createValidationError("A valid email is required"));
  }
  if (typeof password !== "string" || password.length === 0) {
    return next(createValidationError("Password is required"));
  }

  next();
};

const validatePost = (req, res, next) => {
  const { name, description, age } = req.body || {};
  const isPartialUpdate = req.method === "PATCH";

  if (isPartialUpdate && Object.keys(req.body || {}).length === 0) {
    return next(createValidationError("At least one field is required for update"));
  }
  if ((!isPartialUpdate || name !== undefined) &&
      (typeof name !== "string" || name.trim().length < 2)) {
    return next(createValidationError("Name must be at least 2 characters"));
  }
  if ((!isPartialUpdate || description !== undefined) &&
      (typeof description !== "string" || description.trim().length === 0)) {
    return next(createValidationError("Description is required"));
  }
  if ((!isPartialUpdate || age !== undefined) &&
      (typeof age !== "number" || !Number.isInteger(age) || age < 1 || age > 150)) {
    return next(createValidationError("Age must be an integer between 1 and 150"));
  }

  next();
};

const validatePostQuery = (req, res, next) => {
  const { page, limit, sort } = req.query;

  if (page !== undefined && (!/^\d+$/.test(page) || Number(page) < 1)) {
    return next(createValidationError("Page must be a positive integer"));
  }

  if (limit !== undefined && (!/^\d+$/.test(limit) || Number(limit) < 1 || Number(limit) > 100)) {
    return next(createValidationError("Limit must be an integer between 1 and 100"));
  }

  if (sort !== undefined && !["newest", "oldest"].includes(sort)) {
    return next(createValidationError("Sort must be either newest or oldest"));
  }

  next();
};

export { validateRegister, validateLogin, validatePost, validatePostQuery };