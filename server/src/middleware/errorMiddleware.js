export function notFound(req, res, next) {
  res.status(404);
  const err = new Error(`Not found: ${req.originalUrl}`);
  next(err);
}

export function errorHandler(err, req, res, next) {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}
