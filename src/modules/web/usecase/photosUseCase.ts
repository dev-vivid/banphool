import photosService from "../service/photosService";
import { writeAudit } from "../../../services/auditService";
import {
  parsePagination,
  buildPaginationMeta,
} from "../../../shared/helpers/pagination";
import {
  AUDIT_ACTIONS,
  PHOTOS_SORT_FIELDS,
} from "../../../constants";

export const getAll = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const sortBy = PHOTOS_SORT_FIELDS.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";

  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const { rows, total } = await photosService.findAll({
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
  const photos = await photosService.findById(id);

  if (!photos) {
    throw {
      statusCode: 404,
      message: "photos not found",
    };
  }

  return photos;
};

export const create = async (body: any, req: any) => {
  const photos = await photosService.create(body);

  await writeAudit({
    action: AUDIT_ACTIONS.CREATE,
    resource: "photos",
    resourceId: photos.id,
    req,
    newValues: photos,
  });

  return photos;
};

export const update = async (
  id: string,
  body: any,
  req: any
) => {
  const existing = await photosService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "photos not found",
    };
  }

  const updated = await photosService.update(id, body);

  await writeAudit({
    action: AUDIT_ACTIONS.UPDATE,
    resource: "photos",
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
  const existing = await photosService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "photos not found",
    };
  }

  await photosService.remove(id);

  await writeAudit({
    action: AUDIT_ACTIONS.DELETE,
    resource: "photos",
    resourceId: id,
    req,
    oldValues: existing,
  });
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};