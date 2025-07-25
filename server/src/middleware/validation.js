const validator = require('validator');

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  try {
    // Recursively sanitize all string inputs
    const sanitizeObject = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          // Basic XSS protection
          obj[key] = validator.escape(obj[key]);
          // Trim whitespace
          obj[key] = obj[key].trim();
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      }
    };

    if (req.body && typeof req.body === 'object') {
      sanitizeObject(req.body);
    }

    if (req.query && typeof req.query === 'object') {
      sanitizeObject(req.query);
    }

    if (req.params && typeof req.params === 'object') {
      sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    console.error('Input sanitization error:', error);
    res.status(400).json({ message: 'Invalid input format' });
  }
};

// Email validation
const validateEmail = (email) => {
  return validator.isEmail(email) && validator.isLength(email, { max: 254 });
};

// Password validation
const validatePassword = (password) => {
  return validator.isLength(password, { min: 6, max: 128 });
};

// MongoDB ObjectId validation
const validateObjectId = (id) => {
  return validator.isMongoId(id);
};

// Date validation
const validateDate = (date) => {
  return validator.isISO8601(date);
};

// URL validation
const validateURL = (url) => {
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true
  });
};

module.exports = {
  sanitizeInput,
  validateEmail,
  validatePassword,
  validateObjectId,
  validateDate,
  validateURL
};