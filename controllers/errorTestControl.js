exports.triggerError = (req, res, next) => {
  // Throw an intentional error
  const err = new Error("Intentional server error for testing purposes.");
  err.status = 500;
  next(err);
};
