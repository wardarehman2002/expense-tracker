// middleware/validate.js
// A middleware FACTORY. Call it with the field names that must be present
// on req.body, and it returns a middleware function that enforces that.
//
// Usage: router.post('/', validate('title', 'amount', 'category'), createExpense);

const validate = (...requiredFields) => (req, res, next) => {
  const missingFields = requiredFields.filter((field) => {
    const value = req.body[field];
    // Treat undefined, null, and empty string as "missing" -
    // but allow an explicit boolean false to count as present.
    return value === undefined || value === null || value === '';
  });

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missingFields.join(', ')}`,
    });
  }

  next();
};

module.exports = validate;
