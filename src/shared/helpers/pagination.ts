import { PAGINATION } from "../../constants";

/**
 * Parse & normalise pagination params from req.query
 */
export const parsePagination = (query: any) => {
  const page = Math.max(1, parseInt(query.page as string) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit as string) || PAGINATION.DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build a pagination meta object for responses
 */
export const buildPaginationMeta = (total: number, page: number, limit: number) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNext: page < Math.ceil(total / limit),
  hasPrev: page > 1,
});

export default { parsePagination, buildPaginationMeta };
