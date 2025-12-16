module.exports = (req, error, details = null, messageOverride = null) => ({
  timestamp: new Date().toISOString(),
  path: req.originalUrl,
  status: error.status,
  code: error.code,
  message: messageOverride || error.message,
  details,
});
