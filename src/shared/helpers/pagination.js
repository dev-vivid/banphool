const { PAGINATION } = require('../../constants');

/**
 * Parse & normalise pagination params from req.query
 */
const parsePagination = (query) => {
  const page  = Math.max(1, parseInt(query.page)  || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT));
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build a pagination meta object for responses
 */
const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNext:    page < Math.ceil(total / limit),
  hasPrev:    page > 1,
});

module.exports = { parsePagination, buildPaginationMeta };
