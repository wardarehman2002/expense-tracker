// middleware/logger.js
// Logs every incoming request as: [ISO-timestamp] METHOD /url
// The HTTP method is padded to 6 characters so log lines line up neatly.

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const paddedMethod = req.method.padEnd(6);
  console.log(`[${timestamp}] ${paddedMethod} ${req.url}`);
  next();
};

module.exports = logger;
