import videosService from "../service/videosService";
import { writeAudit } from "../../../services/auditService";
import {
  parsePagination,
  buildPaginationMeta,
} from "../../../shared/helpers/pagination";
import {
  AUDIT_ACTIONS,
  VIDEOS_SORT_FIELDS,
} from "../../../constants";

export const getAll = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const sortBy = VIDEOS_SORT_FIELDS.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";

  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const { rows, total } = await videosService.findAll({
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
  const videos = await videosService.findById(id);

  if (!videos) {
    throw {
      statusCode: 404,
      message: "Videos not found",
    };
  }

  return videos;
};

export const create = async (body: any, req: any) => {
  const videos = await videosService.create(body);

  await writeAudit({
    action: AUDIT_ACTIONS.CREATE,
    resource: "videos",
    resourceId: videos.id,
    req,
    newValues: videos,
  });

  return videos;
};

export const update = async (
  id: string,
  body: any,
  req: any
) => {
  const existing = await videosService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "Videos not found",
    };
  }

  const updated = await videosService.update(id, body);

  await writeAudit({
    action: AUDIT_ACTIONS.UPDATE,
    resource: "videos",
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
  const existing = await videosService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "Videos not found",
    };
  }

  await videosService.remove(id);

  await writeAudit({
    action: AUDIT_ACTIONS.DELETE,
    resource: "videos",
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