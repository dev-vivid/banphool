const { validationResult } = require('express-validator');
const response = require('../shared/utils/response');
const { MESSAGES } = require('../constants');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return response.badRequest(res, MESSAGES.VALIDATION_FAIL, errors.array());
  next();
};

module.exports = validate;
