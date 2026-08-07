import newsService from "../service/newsService";
import { writeAudit } from "../../../services/auditService";
import {
  parsePagination,
  buildPaginationMeta,
} from "../../../shared/helpers/pagination";
import {
  AUDIT_ACTIONS,
  NEWS_SORT_FIELDS,
} from "../../../constants";

export const getAll = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const sortBy = NEWS_SORT_FIELDS.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";

  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const { rows, total } = await newsService.findAll({
    search: query.search || undefined,
    sortBy,
    sortOrder,
    skip,
    limit,
  });

  return {
    data: rows,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

export const getById = async (id: string) => {
  const news = await newsService.findById(id);

  if (!news) {
    throw {
      statusCode: 404,
      message: "News not found",
    };
  }

  return news;
};

export const create = async (body: any, req: any) => {
  const news = await newsService.create(body);

  await writeAudit({
    action: AUDIT_ACTIONS.CREATE,
    resource: "news",
    resourceId: news.id,
    req,
    newValues: news,
  });

  return news;
};

export const update = async (
  id: string,
  body: any,
  req: any
) => {
  const existing = await newsService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "News not found",
    };
  }

  const updated = await newsService.update(id, body);

  await writeAudit({
    action: AUDIT_ACTIONS.UPDATE,
    resource: "news",
    resourceId: id,
    req,
    oldValues: existing,
    newValues: updated,
  });

  return updated;
};

export const remove = async (
  id: string,
  req: any
) => {
  const existing = await newsService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "News not found",
    };
  }

  await newsService.remove(id);

  await writeAudit({
    action: AUDIT_ACTIONS.DELETE,
    resource: "news",
    resourceId: id,
    req,
    oldValues: existing,
  });
};

export const updateStatus = async (
  id: string,
  isActive: boolean,
  req: any
) => {
  const existing = await newsService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "Volunteer not found",
    };
  }

  const updated = await newsService.updateStatus(id, isActive);

  await writeAudit({
    action: isActive
      ? AUDIT_ACTIONS.UPDATE
      : AUDIT_ACTIONS.UPDATE,
    resource: "volunteers",
    resourceId: id,
    req,
    oldValues: existing,
    newValues: {
      isActive,
    },
  });

  return updated;
};

export default {
  getAll,
  getById,
  create,
  update,
  updateStatus,
  remove,
};