module.exports = (message, status = "failed", statusCode = 500) => {
  const err = new Error(message);
  err.status = status;
  err.statusCode = statusCode;
  return err;
};
