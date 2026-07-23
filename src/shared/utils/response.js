/**
 * Standardised API response helpers
 */

const success = (res, data = {}, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

const paginated = (res, data, pagination, message = 'Success') =>
  res.status(200).json({ success: true, message, data, pagination });

const created = (res, data = {}, message = 'Created successfully') =>
  success(res, data, message, 201);

const error = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};

const notFound    = (res, msg = 'Resource not found') => error(res, msg, 404);
const badRequest  = (res, msg = 'Bad request', errs)  => error(res, msg, 400, errs);
const unauthorized= (res, msg = 'Unauthorized')        => error(res, msg, 401);
const forbidden   = (res, msg = 'Forbidden')           => error(res, msg, 403);
const conflict    = (res, msg = 'Conflict')            => error(res, msg, 409);

module.exports = { success, paginated, created, error, notFound, badRequest, unauthorized, forbidden, conflict };
