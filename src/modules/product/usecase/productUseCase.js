const productService = require('../service/productService');
const { writeAudit } = require('../../../services/auditService');
const { parsePagination, buildPaginationMeta } = require('../../../shared/helpers/pagination');
const { AUDIT_ACTIONS, PRODUCT_SORT_FIELDS } = require('../../../constants');

const getAll = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const sortBy    = PRODUCT_SORT_FIELDS.includes(query.sortBy) ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

  const { rows, total } = await productService.findAll({
    search: query.search || null,
    category: query.category || null,
    sortBy, sortOrder, skip, limit,
  });

  return { data: rows, pagination: buildPaginationMeta(total, page, limit) };
};

const getById = async (id) => {
  const product = await productService.findById(id);
  if (!product) throw { statusCode: 404, message: 'Product not found' };
  return product;
};

const create = async (body, req) => {
  const product = await productService.create(body, req.user.id);
  await writeAudit({ action: AUDIT_ACTIONS.CREATE, resource: 'products', resourceId: product.id, req, newValues: body });
  return product;
};

const update = async (id, body, req) => {
  const old = await productService.findById(id);
  if (!old) throw { statusCode: 404, message: 'Product not found' };

  const updated = await productService.update(id, body, req.user.id);
  await writeAudit({ action: AUDIT_ACTIONS.UPDATE, resource: 'products', resourceId: id, req, oldValues: old, newValues: body });
  return updated;
};

const remove = async (id, req) => {
  const existing = await productService.findById(id);
  if (!existing) throw { statusCode: 404, message: 'Product not found' };

  await productService.softDelete(id, req.user.id);
  await writeAudit({ action: AUDIT_ACTIONS.DELETE, resource: 'products', resourceId: id, req, oldValues: existing });
};

module.exports = { getAll, getById, create, update, remove };
