module.exports = (err, req, res, next)=> {
  const { statusCode, message,status, stack } = err;
  res.status(statusCode).json({
    status,
    message,
    stack,
  });
}
