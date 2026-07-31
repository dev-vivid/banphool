import eventsService from "../service/eventsService";
import { writeAudit } from "../../../services/auditService";
import {
  parsePagination,
  buildPaginationMeta,
} from "../../../shared/helpers/pagination";
import {
  AUDIT_ACTIONS,
  EVENTS_SORT_FIELDS,
} from "../../../constants";

export const getAll = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const sortBy = EVENTS_SORT_FIELDS.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";

  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const { rows, total } = await eventsService.findAll({
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
  const events = await eventsService.findById(id);

  if (!events) {
    throw {
      statusCode: 404,
      message: "Events not found",
    };
  }

  return events;
};

export const create = async (body: any, req: any) => {
  const events = await eventsService.create(body);

  await writeAudit({
    action: AUDIT_ACTIONS.CREATE,
    resource: "events",
    resourceId: events.id,
    req,
    newValues: events,
  });

  return events;
};

export const update = async (
  id: string,
  body: any,
  req: any
) => {
  const existing = await eventsService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "Events not found",
    };
  }

  const updated = await eventsService.update(id, body);

  await writeAudit({
    action: AUDIT_ACTIONS.UPDATE,
    resource: "events",
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
  const existing = await eventsService.findById(id);

  if (!existing) {
    throw {
      statusCode: 404,
      message: "Events not found",
    };
  }

  await eventsService.remove(id);

  await writeAudit({
    action: AUDIT_ACTIONS.DELETE,
    resource: "events",
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